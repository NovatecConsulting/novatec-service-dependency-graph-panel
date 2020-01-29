import _ from 'lodash';
import { ServiceDependencyGraphCtrl } from '../service_dependency_graph_ctrl';
import ParticleEngine from './particle_engine';
import { CyCanvas, IGraphMetrics, Particle, EGraphNodeType, Particles } from '../types';

export default class CanvasDrawer {

    readonly colors = {
        default: '#bad5ed',
        background: '#212121',
        edge: '#505050',
        status: {
            warning: 'orange'
        }
    };

    readonly donutRadius: number = 15;

    controller: ServiceDependencyGraphCtrl;

    cytoscape: cytoscape.Core;

    context: CanvasRenderingContext2D;

    cyCanvas: CyCanvas;

    canvas: HTMLCanvasElement;

    offscreenCanvas: HTMLCanvasElement;

    offscreenContext: CanvasRenderingContext2D;

    frameCounter: number = 0;

    fpsCounter: number = 0;

    particleImage: HTMLImageElement;

    pixelRatio: number;

    imageAssets = {};

    selectionNeighborhood: cytoscape.Collection;

    particleEngine: ParticleEngine;

    lastRenderTime: number = 0;

    constructor(ctrl: ServiceDependencyGraphCtrl, cy: cytoscape.Core, cyCanvas: CyCanvas) {
        this.cytoscape = cy;
        this.cyCanvas = cyCanvas;
        this.controller = ctrl;
        this.particleEngine = new ParticleEngine(this);

        this.pixelRatio = window.devicePixelRatio || 1;

        this.canvas = cyCanvas.getCanvas();
        const ctx = this.canvas.getContext("2d");
        if (ctx) {
            this.context = ctx;
        } else {
            console.error("Could not get 2d canvas context.");
        }

        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenContext = <CanvasRenderingContext2D>this.offscreenCanvas.getContext('2d');
    }

    _loadImage(imageUrl: string, assetName: string) {
        const that = this;

        const loadImage = (url, asset) => {
            const image = new Image();
            that.imageAssets[asset] = {
                image,
                loaded: false
            };

            return new Promise((resolve, reject) => {
                image.onload = () => resolve(asset);
                image.onerror = () => reject(new Error(`load ${url} fail`));
                image.src = url;
            });
        };
        loadImage(imageUrl, assetName)
            .then((asset: string) => {
                that.imageAssets[asset].loaded = true;
            });
    }

    _isImageLoaded(assetName: string) {
        if (_.has(this.imageAssets, assetName) && this.imageAssets[assetName].loaded) {
            return true;
        } else {
            return false;
        }
    }

    _getImageAsset(assetName) {
        if (!_.has(this.imageAssets, assetName)) {
            const assetUrl = this.controller.getTypeSymbol(assetName);
            this._loadImage(assetUrl, assetName);
        }

        if (this._isImageLoaded(assetName)) {
            return <HTMLImageElement>this.imageAssets[assetName].image;
        } else {
            return null;
        }
    }

    _getAsset(assetUrl, assetName) {
        if (!_.has(this.imageAssets, assetName)) {
            this._loadImage(assetUrl, assetName);
        }

        if (this._isImageLoaded(assetName)) {
            return <HTMLImageElement>this.imageAssets[assetName].image;
        } else {
            return null;
        }
    }

    start() {
        console.log("Starting graph logic");

        const that = this;
        const repaintWrapper = () => {
            that.repaint();
            window.requestAnimationFrame(repaintWrapper);
        }

        window.requestAnimationFrame(repaintWrapper);

        setInterval(() => {
            that.fpsCounter = that.frameCounter;
            that.frameCounter = 0;
        }, 1000);
    }

    startAnimation() {
        this.particleEngine.start();
    }

    stopAnimation() {
        this.particleEngine.stop();
    }

    _skipFrame() {
        const now = Date.now();
        const elapsedTime = now - this.lastRenderTime;

        if (this.particleEngine.count() > 0) {
            return false;
        }

        if (!this.controller.panel.settings.animate && elapsedTime < 1000) {
            return true;
        }
        return false;

    }

    repaint(forceRepaint: boolean = false) {
        if (!forceRepaint && this._skipFrame()) {
            return;
        }
        this.lastRenderTime = Date.now();

        const ctx = this.context;
        const cyCanvas = this.cyCanvas;
        const offscreenCanvas = this.offscreenCanvas;
        const offscreenContext = this.offscreenContext;

        offscreenCanvas.width = this.canvas.width;
        offscreenCanvas.height = this.canvas.height;

        // offscreen rendering
        this._setTransformation(offscreenContext);

        this.selectionNeighborhood = this.cytoscape.collection();
        const selection = this.cytoscape.$(':selected');
        selection.forEach((element: cytoscape.SingularElementArgument) => {
            this.selectionNeighborhood.merge(element);

            if (element.isNode()) {
                const neighborhood = element.neighborhood();
                this.selectionNeighborhood.merge(neighborhood);
            } else {
                const source = element.source();
                const target = element.target();
                this.selectionNeighborhood.merge(source);
                this.selectionNeighborhood.merge(target);
            }
        });

        this._drawEdgeAnimation(offscreenContext);
        this._drawNodes(offscreenContext);

        // static element rendering
        // cyCanvas.resetTransform(ctx);
        cyCanvas.clear(ctx);

        if (this.controller.getSettings().showDebugInformation) {
            this._drawDebugInformation();
        }

        if (offscreenCanvas.width > 0 && offscreenCanvas.height > 0)
            ctx.drawImage(offscreenCanvas, 0, 0);
    }

    _setTransformation(ctx: CanvasRenderingContext2D) {
        const pan = this.cytoscape.pan();
        const zoom = this.cytoscape.zoom();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.translate(pan.x * this.pixelRatio, pan.y * this.pixelRatio);
        ctx.scale(zoom * this.pixelRatio, zoom * this.pixelRatio);
    }

    _drawEdgeAnimation(ctx: CanvasRenderingContext2D) {
        const now = Date.now();

        ctx.save();

        const edges = this.cytoscape.edges().toArray();
        const hasSelection = this.selectionNeighborhood.size() > 0;

        // transparent edges
        if (hasSelection) {
            ctx.globalAlpha = 0.25;

            for (let i = 0; i < edges.length; i++) {
                const edge = edges[i];

                if (!this.selectionNeighborhood.has(edge)) {
                    this._drawEdge(ctx, edge, now);
                }
            }
        }

        // visible edges
        ctx.globalAlpha = 1;

        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];

            if (!hasSelection || this.selectionNeighborhood.has(edge)) {
                this._drawEdge(ctx, edge, now);
            }
        }

        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.restore();
    }

    _drawEdge(ctx: CanvasRenderingContext2D, edge: cytoscape.EdgeSingular, now: number) {
        const cy = this.cytoscape;
        const sourcePoint = edge.sourceEndpoint();
        const targetPoint = edge.targetEndpoint();

        // draw edge line
        this._drawEdgeLine(ctx, edge, sourcePoint, targetPoint);

        // draw particles
        this._drawEdgeParticles(ctx, edge, sourcePoint, targetPoint, now);

        // draw label
        const { showConnectionStats } = this.controller.getSettings();
        if (showConnectionStats && cy.zoom() > 1) {
            this._drawEdgeLabel(ctx, edge);
        }
    }

    _drawEdgeLine(ctx: CanvasRenderingContext2D, edge: cytoscape.EdgeSingular, sourcePoint: cytoscape.Position, targetPoint: cytoscape.Position) {
        ctx.beginPath();

        ctx.moveTo(sourcePoint.x, sourcePoint.y);
        ctx.lineTo(targetPoint.x, targetPoint.y);

        const metrics = edge.data('metrics');
        const requestCount = _.get(metrics, 'normal', -1);
        const errorCount = _.get(metrics, 'danger', -1);

        let base;
        if (!this.selectionNeighborhood.empty() && this.selectionNeighborhood.has(edge)) {
            ctx.lineWidth = 3;
            base = 140;
        } else {
            ctx.lineWidth = 1;
            base = 80;
        }

        if (requestCount >= 0 && errorCount >= 0) {
            const range = 255;

            const factor = errorCount / (requestCount + errorCount);
            const color = Math.min(255, base + range * Math.log2(factor + 1));

            ctx.strokeStyle = 'rgb(' + color + ',' + base + ',' + base + ')';
        } else {
            ctx.strokeStyle = 'rgb(' + base + ',' + base + ',' + base + ')';
        }

        ctx.stroke();
    }

    _drawEdgeLabel(ctx: CanvasRenderingContext2D, edge: cytoscape.EdgeSingular) {
        const midpoint = edge.midpoint();
        const xMid = midpoint.x;
        const yMid = midpoint.y;

        let statistics: string[] = [];

        const metrics: IGraphMetrics = edge.data('metrics');
        const duration = _.defaultTo(metrics.response_time, -1);
        const requestCount = _.defaultTo(metrics.rate, -1);
        const errorCount = _.defaultTo(metrics.error_rate, -1);

        if (duration >= 0) {
            statistics.push(Math.floor(duration) + ' ms');
        }
        if (requestCount >= 0) {
            statistics.push(Math.floor(requestCount) + ' Requests');
        }
        if (errorCount >= 0) {
            statistics.push(Math.floor(errorCount) + ' Errors');
        }

        if (statistics.length > 0) {
            const edgeLabel = statistics.join(', ');
            this._drawLabel(ctx, edgeLabel, xMid, yMid);
        }
    }

    _drawEdgeParticles(ctx: CanvasRenderingContext2D, edge: cytoscape.EdgeSingular, sourcePoint: cytoscape.Position, targetPoint: cytoscape.Position, now: number) {
        const particles: Particles = edge.data('particles');

        if (particles === undefined) {
            return;
        }

        const xVector = targetPoint.x - sourcePoint.x;
        const yVector = targetPoint.y - sourcePoint.y;

        const angle = Math.atan2(yVector, xVector);
        const xDirection = Math.cos(angle);
        const yDirection = Math.sin(angle);

        const xMinLimit = Math.min(sourcePoint.x, targetPoint.x);
        const xMaxLimit = Math.max(sourcePoint.x, targetPoint.x);
        const yMinLimit = Math.min(sourcePoint.y, targetPoint.y);
        const yMaxLimit = Math.max(sourcePoint.y, targetPoint.y);

        const drawContext = {
            ctx,
            now,
            xDirection,
            yDirection,
            xMinLimit,
            xMaxLimit,
            yMinLimit,
            yMaxLimit,
            sourcePoint
        };

        // normal particles
        ctx.beginPath();

        let index = particles.normal.length - 1;
        while (index >= 0) {
            this._drawParticle(drawContext, particles.normal, index);
            index--;
        }

        ctx.fillStyle = '#d1e2f2';
        ctx.fill();

        // danger particles
        ctx.beginPath();

        index = particles.danger.length - 1;
        while (index >= 0) {
            this._drawParticle(drawContext, particles.danger, index);
            index--;
        }

        ctx.fillStyle = 'red';
        ctx.fill();
    }

    _drawLabel(ctx: CanvasRenderingContext2D, label: string, cX: number, cY: number) {
        const labelPadding = 1;
        ctx.font = '6px Arial';

        const labelWidth = ctx.measureText(label).width;
        const xPos = cX - labelWidth / 2;
        const yPos = cY + 3;

        ctx.fillStyle = this.colors.default;
        ctx.fillRect(xPos - labelPadding, yPos - 6 - labelPadding, labelWidth + 2 * labelPadding, 6 + 2 * labelPadding);

        ctx.fillStyle = this.colors.background;
        ctx.fillText(label, xPos, yPos);
    }

    _drawParticle(drawCtx, particles: Particle[], index: number) {
        const { ctx,
            now,
            xDirection,
            yDirection,
            xMinLimit,
            xMaxLimit,
            yMinLimit,
            yMaxLimit,
            sourcePoint } = drawCtx;

        const particle = particles[index];

        const timeDelta = now - particle.startTime;
        const xPos = sourcePoint.x + (xDirection * timeDelta * particle.velocity);
        const yPos = sourcePoint.y + (yDirection * timeDelta * particle.velocity);

        if (xPos > xMaxLimit || xPos < xMinLimit || yPos > yMaxLimit || yPos < yMinLimit) {
            // remove particle
            particles.splice(index, 1);
        } else {
            // draw particle
            ctx.moveTo(xPos, yPos);
            ctx.arc(xPos, yPos, 1, 0, 2 * Math.PI, false);
        }
    }

    _drawNodes(ctx: CanvasRenderingContext2D) {
        const that = this;
        const cy = this.cytoscape;

        // Draw model elements
        const nodes = cy.nodes().toArray();
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if (that.selectionNeighborhood.empty() || that.selectionNeighborhood.has(node)) {
                ctx.globalAlpha = 1;
            } else {
                ctx.globalAlpha = 0.25;
            }

            // draw the node
            that._drawNode(ctx, node);

            // drawing the node label in case we are not zoomed out
            if (cy.zoom() > 1) {
                that._drawNodeLabel(ctx, node);
            }
        }
    }

    _drawNode(ctx: CanvasRenderingContext2D, node: cytoscape.NodeSingular) {
        const cy = this.cytoscape;
        const type = node.data('type');
        const metrics: IGraphMetrics = node.data('metrics');

        if (type === EGraphNodeType.INTERNAL) {
            const requestCount = _.defaultTo(metrics.rate, 1);
            const errorCount = _.defaultTo(metrics.error_rate, 0);

            const totalCount = requestCount + errorCount;
            var healthyPct;
            if (totalCount <= 0) {
                healthyPct = 1.0;
            } else {
                healthyPct = 1.0 / totalCount * requestCount;
            }
            const errorPct = 1.0 - healthyPct;

            // drawing the donut
            this._drawDonut(ctx, node, 15, 5, 0.5, [errorPct, 0, healthyPct])
        } else {
            this._drawExternalService(ctx, node);
        }

        // draw statistics
        if (cy.zoom() > 1) {
            this._drawNodeStatistics(ctx, node);
        }
    }

    _drawNodeStatistics(ctx: CanvasRenderingContext2D, node: cytoscape.NodeSingular) {
        const lines: string[] = [];

        const metrics = node.data('metrics');
        const requestCount = _.get(metrics, 'rate', -1);
        const errorCount = _.get(metrics, 'error_rate', -1);
        const responseTime = _.get(metrics, 'response_time', -1);

        if (requestCount >= 0) {
            lines.push('Requests: ' + Math.floor(requestCount));
        }
        if (errorCount >= 0) {
            lines.push('Errors: ' + Math.floor(errorCount));
        }
        if (responseTime >= 0) {
            lines.push('Avg. Resp. Time: ' + Math.floor(responseTime) + ' ms');
        }

        const pos = node.position();
        const fontSize = 6;
        const cX = pos.x + this.donutRadius * 1.25;
        const cY = pos.y + fontSize / 2 - (fontSize / 2) * (lines.length - 1);

        ctx.font = '6px Arial';
        ctx.fillStyle = this.colors.default;
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], cX, cY + i * fontSize);
        }
    }

    _drawExternalService(ctx: CanvasRenderingContext2D, node: cytoscape.NodeSingular) {
        const pos = node.position();
        const cX = pos.x;
        const cY = pos.y;
        const size = 12;

        ctx.beginPath();
        ctx.arc(cX, cY, 12, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cX, cY, 11.5, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.colors.background;
        ctx.fill();

        const nodeType = node.data('external_type');

        const image = this._getImageAsset(nodeType);
        if (image != null) {
            ctx.drawImage(image, cX - size / 2, cY - size / 2, size, size);
        }
    }

    _drawNodeLabel(ctx: CanvasRenderingContext2D, node: cytoscape.NodeSingular) {
        const pos = node.position();
        let label: string = node.id();
        const labelPadding = 1;

        if (this.selectionNeighborhood.empty() || !this.selectionNeighborhood.has(node)) {
            if (label.length > 20) {
                label = label.substr(0, 7) + '...' + label.slice(-7);
            }
        }

        ctx.font = '6px Arial';

        const labelWidth = ctx.measureText(label).width;
        const xPos = pos.x - labelWidth / 2;
        const yPos = pos.y + node.height() * 0.8;

        ctx.fillStyle = this.colors.default;
        ctx.fillRect(xPos - labelPadding, yPos - 6 - labelPadding, labelWidth + 2 * labelPadding, 6 + 2 * labelPadding);

        ctx.fillStyle = this.colors.background;
        ctx.fillText(label, xPos, yPos);
    }

    _drawDebugInformation() {
        const ctx = this.context;

        this.frameCounter++;

        ctx.font = '12px monospace';
        ctx.fillStyle = 'white';
        ctx.fillText("Frames per Second: " + this.fpsCounter, 10, 12);
        ctx.fillText("Particles: " + this.particleEngine.count(), 10, 24);
    }

    _drawDonut(ctx: CanvasRenderingContext2D, node: cytoscape.NodeSingular, radius, width, strokeWidth, percentages) {
        const cX = node.position().x;
        const cY = node.position().y;

        let currentArc = -Math.PI / 2; // offset

        ctx.beginPath();
        ctx.arc(cX, cY, radius + strokeWidth, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white';
        ctx.fill();

        const { healthyColor, dangerColor } = this.controller.getSettings().style;
        const colors = [dangerColor, this.colors.status.warning, healthyColor];
        for (let i = 0; i < percentages.length; i++) {
            let arc = this._drawArc(ctx, currentArc, cX, cY, radius, percentages[i], colors[i]);
            currentArc += arc;
        }

        ctx.beginPath();
        ctx.arc(cX, cY, radius - width, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'white';
        ctx.fill();

        // // cut out an inner-circle == donut
        //ctx.save();
        ctx.beginPath();
        ctx.arc(cX, cY, radius - width - strokeWidth, 0, 2 * Math.PI, false);
        if (node.selected()) {
            ctx.fillStyle = 'white';
        } else {
            ctx.fillStyle = this.colors.background;
        }
        ctx.fill();
        // ctx.clip();
        // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // ctx.restore();
    }

    _drawArc(ctx: CanvasRenderingContext2D, currentArc, cX, cY, radius, percent, color) {
        // calc size of our wedge in radians
        var WedgeInRadians = percent * 360 * Math.PI / 180;
        // draw the wedge
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cX, cY);
        ctx.arc(cX, cY, radius, currentArc, currentArc + WedgeInRadians, false);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
        // sum the size of all wedges so far
        // We will begin our next wedge at this sum
        return WedgeInRadians;
    }
};
