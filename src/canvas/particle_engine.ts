import CanvasDrawer from "./graph_canvas";
import _ from 'lodash'; //{ defaultTo }
import { Particles, Particle } from "../types"; //IGraphMetrics

export default class ParticleEngine {

    drawer: CanvasDrawer;

    maxVolume: number = 1000;

    minSpawnPropability: number = 0.005;

    spawnInterval: any;

    animating: boolean;
    
    constructor(canvasDrawer: CanvasDrawer) {
        this.drawer = canvasDrawer;
        this.animating = false;
    }

    start() {
        this.animating = true
        if (!this.spawnInterval) {
            const that = this;
            this.spawnInterval = setInterval(() => that.animate(), 50);
        }
    }

    stop() {
        this.animating = false
    }

    animate(){
        const that = this
        if(!that.animating) {
            if(!this.hasParticles()) {
                clearInterval(this.spawnInterval);
                this.spawnInterval = null;
            }
        } else {
            that._spawnParticles()
        }
        that.drawer.repaint();
    }

    hasParticles(){
        for(const edge of this.drawer.cytoscape.edges().toArray()) {
            console.log(edge)
            if(edge.data('particles') !== undefined &&  (edge.data('particles').normal.length > 0 || edge.data('particles').danger.length > 0)) {
                return true
            } 
        }
        return false
    }

    _spawnParticles() {
        const cy = this.drawer.cytoscape;

        const now = Date.now();
        console.log(cy.edges())
        cy.edges().forEach(edge => {
            console.log(edge)
            let particles: Particles = edge.data('particles');
            //const metrics: IGraphMetrics = edge.data('metrics');

            //TODO
            /*if (!metrics) {
                return;
            }*/

            const rate = 100//TODO defaultTo(metrics.rate, 0);
            const error_rate = 101// TODOdefaultTo(metrics.error_rate, 0);
            const volume = rate + error_rate;

            let errorRate;
            if (rate >= 0 && error_rate >= 0) {
                errorRate = error_rate / rate;
            } else {
                errorRate = 0;
            }

            if (particles === undefined) {
                particles = {
                    normal: [],
                    danger: []
                };
                edge.data('particles', particles);
            }
            //TODO ADD metrics && 
            if (volume > 0) {
                const spawnPropability = Math.min(volume / this.maxVolume, 1.0);
                for (let i = 0; i < 5; i++) {
                    if (Math.random() <= spawnPropability + this.minSpawnPropability) {
                        const particle: Particle = {
                            velocity: 0.05 + (Math.random() * 0.05),
                            startTime: now
                        };
                        if (Math.random() < errorRate) {
                            particles.danger.push(particle);
                        } else {
                            particles.normal.push(particle);
                        }
                        
                    }
                }
            }
        });
    }

    count() {
        const cy = this.drawer.cytoscape;

        const count = _(cy.edges())
            .map(edge => edge.data('particles'))
            .filter()
            .map(particleArray => particleArray.normal.length + particleArray.danger.length)
            .sum();

        return count;
    }
}