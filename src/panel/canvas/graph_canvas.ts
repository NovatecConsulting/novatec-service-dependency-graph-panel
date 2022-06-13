import _ from 'lodash';
import cytoscape from 'cytoscape';
import { ServiceDependencyGraph } from '../serviceDependencyGraph/ServiceDependencyGraph';
import ParticleEngine from './particle_engine';
import {
  CyCanvas,
  Particle,
  EnGraphNodeType,
  Particles,
  IntGraphMetrics,
  ScaleValue,
  DrawContext,
  Rectangle,
  Point,
} from '../../types';
import humanFormat from 'human-format';
import assetUtils from '../asset_utils';
import CollisionDetector from './collision_detector';

const scaleValues: ScaleValue[] = [
  { unit: 'ms', factor: 1 },
  { unit: 's', factor: 1000 },
  { unit: 'm', factor: 60000 },
];

export default class CanvasDrawer {
  readonly colors = {
    default: '#bad5ed',
    background: '#212121',
    edge: '#505050',
    status: {
      warning: 'orange',
    },
  };

  readonly donutRadius: number = 15;

  controller: ServiceDependencyGraph;

  cytoscape: cytoscape.Core;

  context: CanvasRenderingContext2D;

  cyCanvas: CyCanvas;

  canvas: HTMLCanvasElement;

  offscreenCanvas: HTMLCanvasElement;

  offscreenContext: CanvasRenderingContext2D;

  frameCounter = 0;

  fpsCounter = 0;

  particleImage: HTMLImageElement;

  pixelRatio: number;

  imageAssets: any = {};

  selectionNeighborhood: cytoscape.Collection;

  particleEngine: ParticleEngine;

  collisionDetector: CollisionDetector;

  lastRenderTime = 0;

  dashAnimationOffset = 0;

  constructor(ctrl: ServiceDependencyGraph, cy: cytoscape.Core, cyCanvas: CyCanvas) {
    this.cytoscape = cy;
    this.cyCanvas = cyCanvas;
    this.controller = ctrl;
    this.particleEngine = new ParticleEngine(this);
    this.collisionDetector = new CollisionDetector();

    this.pixelRatio = window.devicePixelRatio || 1;

    this.canvas = cyCanvas.getCanvas();
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      this.context = ctx;
    } else {
      console.error('Could not get 2d canvas context.');
    }

    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenContext = this.offscreenCanvas.getContext('2d');

    this.repaint(true);
  }

  _getTimeScale(timeUnit: string) {
    const scale: any = {};
    for (const scaleValue of scaleValues) {
      scale[scaleValue.unit] = scaleValue.factor;
      if (scaleValue.unit === timeUnit) {
        return scale;
      }
    }
    return scale;
  }

  resetAssets() {
    this.imageAssets = {};
  }

  _loadImage(imageUrl: string, assetName: string) {
    const that = this;

    const loadImage = (url: string, asset: keyof typeof that.imageAssets) => {
      const image = new Image();
      that.imageAssets[asset] = {
        image,
        loaded: false,
      };

      return new Promise((resolve, reject) => {
        image.onload = () => resolve(asset);
        image.onerror = () => reject(new Error(`load ${url} fail`));
        image.src = url;
      });
    };
    loadImage(imageUrl, assetName).then((asset: any) => {
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

  _getImageAsset(assetName: string, resolveName = true) {
    if (!_.has(this.imageAssets, assetName)) {
      const { externalIcons } = this.controller.getSettings(true);
      const assetUrl = assetUtils.getTypeSymbol(assetName, externalIcons, resolveName);
      this._loadImage(assetUrl, assetName);
    }

    if (this._isImageLoaded(assetName)) {
      return this.imageAssets[assetName].image;
    } else {
      return null;
    }
  }

  _getAsset(assetName: string, relativeUrl: string) {
    if (!_.has(this.imageAssets, assetName)) {
      const assetUrl = assetUtils.getAssetUrl(relativeUrl);
      this._loadImage(assetUrl, assetName);
    }

    if (this._isImageLoaded(assetName)) {
      return this.imageAssets[assetName].image;
    } else {
      return null;
    }
  }

  start() {
    console.log('Starting graph logic');

    const that = this;
    const repaintWrapper = () => {
      that.repaint();
      window.requestAnimationFrame(repaintWrapper);
    };

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
    this.repaint();
  }

  _skipFrame() {
    const now = Date.now();
    const elapsedTime = now - this.lastRenderTime;

    if (this.particleEngine.count() > 0) {
      return false;
    }

    if (!this.controller.getSettings(true).animate && elapsedTime < 1000) {
      return true;
    }
    return false;
  }

  repaint(forceRepaint = false) {
    if (!forceRepaint && this._skipFrame()) {
      return;
    }
    this.lastRenderTime = Date.now();

    const ctx = this.context;
    const cyCanvas = this.cyCanvas;
    const offscreenCanvas = this.offscreenCanvas;
    const offscreenContext = this.offscreenContext;
    this.collisionDetector.reset();

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
    if (this.controller.getSettings(true).showDebugInformation) {
      this._drawDebugInformation();
    }

    if (offscreenCanvas.width > 0 && offscreenCanvas.height > 0) {
      ctx.drawImage(offscreenCanvas, 0, 0);
    }

    // baseline animation
    this.dashAnimationOffset = (Date.now() % 60000) / 250;
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

    const transparentEdges = edges.filter((edge) => hasSelection && !this.selectionNeighborhood.has(edge));
    const opaqueEdges = edges.filter((edge) => !hasSelection || this.selectionNeighborhood.has(edge));

    ctx.globalAlpha = 0.25;
    this._drawEdges(ctx, transparentEdges, now);
    ctx.globalAlpha = 1;
    this._drawEdges(ctx, opaqueEdges, now);
    ctx.restore();
  }

  _drawEdges(ctx: CanvasRenderingContext2D, edges: cytoscape.EdgeSingular[], now: number) {
    const cy = this.cytoscape;

    for (const edge of edges) {
      const sourcePoint = edge.sourceEndpoint();
      const targetPoint = edge.targetEndpoint();
      this._drawEdgeLine(ctx, edge, sourcePoint, targetPoint);
      this._drawEdgeParticles(ctx, edge, sourcePoint, targetPoint, now);
    }

    const { showConnectionStats } = this.controller.getSettings(true);
    if (showConnectionStats && cy.zoom() > 1) {
      for (const edge of edges) {
        this._drawEdgeLabel(ctx, edge);
      }
    }
  }

  _drawEdgeLine(
    ctx: CanvasRenderingContext2D,
    edge: cytoscape.EdgeSingular,
    sourcePoint: cytoscape.Position,
    targetPoint: cytoscape.Position
  ) {
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

      const factor = errorCount / requestCount;
      const color = Math.min(255, base + range * Math.log2(factor + 1));

      ctx.strokeStyle = 'rgb(' + color + ',' + base + ',' + base + ')';
    } else {
      ctx.strokeStyle = 'rgb(' + base + ',' + base + ',' + base + ')';
    }

    ctx.stroke();
  }

  _drawEdgeLabel(ctx: CanvasRenderingContext2D, edge: cytoscape.EdgeSingular) {
    const { timeFormat } = this.controller.getSettings(true);

    const midpoint = edge.midpoint();
    const xMid = midpoint.x;
    const yMid = midpoint.y;

    let statistics: string[] = [];
    const metrics: IntGraphMetrics = edge.data('metrics');
    const duration = _.defaultTo(metrics.response_time, -1);
    const requestCount = _.defaultTo(metrics.rate, -1);
    const errorCount = _.defaultTo(metrics.error_rate, -1);

    const timeScale = new humanFormat.Scale(this._getTimeScale(timeFormat));

    if (duration >= 0) {
      const decimals = duration >= 1000 ? 1 : 0;
      statistics.push(humanFormat(duration, { scale: timeScale, decimals }));
    }
    if (requestCount >= 0) {
      const decimals = requestCount >= 1000 ? 1 : 0;
      statistics.push(humanFormat(parseFloat(requestCount.toString()), { decimals }) + ' Req.');
    }
    if (errorCount >= 0) {
      const decimals = errorCount >= 1000 ? 1 : 0;
      statistics.push(humanFormat(errorCount, { decimals }) + ' Err.');
    }

    if (statistics.length > 0) {
      const edgeLabel = statistics.join(', ');
      this._drawLabel(ctx, edgeLabel, xMid, yMid, edge);
    }
  }

  _drawEdgeParticles(
    ctx: CanvasRenderingContext2D,
    edge: cytoscape.EdgeSingular,
    sourcePoint: cytoscape.Position,
    targetPoint: cytoscape.Position,
    now: number
  ) {
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

    const drawContext: DrawContext = {
      ctx,
      now,
      xDirection,
      yDirection,
      xMinLimit,
      xMaxLimit,
      yMinLimit,
      yMaxLimit,
      sourcePoint,
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

    const dangerColor = this.controller.getSettings(true).style.dangerColor;
    ctx.fillStyle = dangerColor;
    ctx.fill();
  }

  _drawLabel(ctx: CanvasRenderingContext2D, label: string, cX: number, cY: number, edge: cytoscape.EdgeSingular) {
    const labelPadding = 1;
    ctx.font = '6px Arial';

    const labelWidth = ctx.measureText(label).width;
    var xPos = cX - labelWidth / 2;
    var yPos = cY + 3;
    var labelArea: Rectangle = {
      coordinates: {
        x: xPos - labelPadding + 4,
        y: yPos - 6 - labelPadding + 4,
      },
      width: labelWidth,
      height: 6,
    };

    if (!isNaN(labelArea.coordinates.x) || !isNaN(labelArea.coordinates.y) || !isNaN(xPos) || !isNaN(yPos)) {
      // TODO: Rather than using a fixed number here, we should find a way to compute a second boundary condition smarter.
      // This is for the case when all nodes are so close together the labels need to overlap each other.
      const maxRepeats = 1000;
      var repeats = 0;
      while (this.collisionDetector.isColliding(labelArea) && repeats < maxRepeats) {
        const nextPoint = this._getNextPointOnVector(xPos, yPos, edge, 0.999);
        labelArea.coordinates = nextPoint;
        yPos = nextPoint.y;
        xPos = nextPoint.x;
        repeats++;
      }
      this.collisionDetector.addRectangle(xPos - 4, yPos - 4, labelWidth + 12, 12);
    }

    ctx.fillStyle = this.colors.default;
    ctx.fillRect(xPos - labelPadding, yPos - 6 - labelPadding, labelWidth + 2 * labelPadding, 6 + 2 * labelPadding);
    ctx.fillStyle = this.colors.background;
    ctx.fillText(label, xPos, yPos);
  }

  _getNextPointOnVector(x: number, y: number, edge: cytoscape.EdgeSingular, step: number) {
    var yTarget = edge.sourceEndpoint().y;
    var xTarget = edge.sourceEndpoint().x;

    const newPoint: Point = {
      x: xTarget * (1.0 - step) + x * step,
      y: yTarget * (1.0 - step) + y * step,
    };

    return newPoint;
  }

  _drawParticle(drawCtx: DrawContext, particles: Particle[], index: number) {
    const { ctx, now, xDirection, yDirection, xMinLimit, xMaxLimit, yMinLimit, yMaxLimit, sourcePoint } = drawCtx;

    const particle = particles[index];

    const timeDelta = now - particle.startTime;
    const xPos = sourcePoint.x + xDirection * timeDelta * particle.velocity;
    const yPos = sourcePoint.y + yDirection * timeDelta * particle.velocity;

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
      if (node.data().type === 'PARENT') {
        if (
          node.data().layer >= this.controller.state.controller.state.currentLayer ||
          node.data().layer === undefined
        ) {
          that._drawNode(ctx, node);
        }
      } else {
        that._drawNode(ctx, node);
      }

      // drawing the node label in case we are not zoomed out
      if (cy.zoom() > 1) {
        that._drawNodeLabel(ctx, node);
      }
    }
  }

  _drawNode(ctx: CanvasRenderingContext2D, node: cytoscape.NodeSingular) {
    const cy = this.cytoscape;
    const type = node.data('type');
    const metrics: IntGraphMetrics = node.data('metrics');

    if (type === EnGraphNodeType.INTERNAL) {
      const requestCount = _.defaultTo(metrics.rate, -1);
      const errorCount = _.defaultTo(metrics.error_rate, 0);
      const responseTime = _.defaultTo(metrics.response_time, -1);
      const threshold = _.defaultTo(metrics.threshold, -1);

      var unknownPct;
      var errorPct;
      var healthyPct;
      if (requestCount < 0) {
        healthyPct = 0;
        errorPct = 0;
        unknownPct = 1;
      } else {
        if (errorCount <= 0) {
          errorPct = 0.0;
        } else {
          errorPct = (1.0 / requestCount) * errorCount;
        }
        healthyPct = 1.0 - errorPct;
        unknownPct = 0;
      }

      // drawing the donut
      this._drawDonut(ctx, node, 15, 5, 0.5, [errorPct, unknownPct, healthyPct]);

      // drawing the baseline status
      const { showBaselines } = this.controller.getSettings(true);
      if (showBaselines && responseTime >= 0 && threshold >= 0) {
        const thresholdViolation = threshold < responseTime;

        this._drawThresholdStroke(ctx, node, thresholdViolation, 15, 5, 0.5);
      }
      this._drawServiceIcon(ctx, node);
    } else {
      this._drawExternalService(ctx, node);
    }

    // draw statistics
    if (cy.zoom() > 1) {
      this._drawNodeStatistics(ctx, node);
    }
  }

  _drawServiceIcon(ctx: CanvasRenderingContext2D, node: cytoscape.NodeSingular) {
    const nodeId: string = node.id();
    const iconMappings = this.controller.getSettings(true).icons;

    const mapping = _.find(iconMappings, ({ pattern }) => {
      try {
        return new RegExp(pattern).test(nodeId);
      } catch (error) {
        return false;
      }
    });

    if (mapping) {
      const image = this._getAsset(mapping.filename, mapping.filename + '.png');
      if (image != null) {
        const cX = node.position().x;
        const cY = node.position().y;
        const iconSize = 16;

        ctx.drawImage(image, cX - iconSize / 2, cY - iconSize / 2, iconSize, iconSize);
      }
    }
  }

  _drawNodeStatistics(ctx: CanvasRenderingContext2D, node: cytoscape.NodeSingular) {
    const { timeFormat } = this.controller.getSettings(true);
    const lines: string[] = [];

    const metrics: IntGraphMetrics = node.data('metrics');
    const requestCount = _.defaultTo(metrics.rate, -1);
    const errorCount = _.defaultTo(metrics.error_rate, -1);
    const responseTime = _.defaultTo(metrics.response_time, -1);

    const timeScale = new humanFormat.Scale(this._getTimeScale(timeFormat));

    if (requestCount >= 0) {
      const decimals = requestCount >= 1000 ? 1 : 0;
      lines.push('Requests: ' + humanFormat(parseFloat(requestCount.toString()), { decimals }));
    }
    if (errorCount >= 0) {
      const decimals = errorCount >= 1000 ? 1 : 0;
      lines.push('Errors: ' + humanFormat(errorCount, { decimals }));
    }
    if (responseTime >= 0) {
      const decimals = responseTime >= 1000 ? 1 : 0;

      lines.push('Avg. Resp. Time: ' + humanFormat(responseTime, { scale: timeScale, decimals }));
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

  _drawThresholdStroke(
    ctx: CanvasRenderingContext2D,
    node: cytoscape.NodeSingular,
    violation: boolean,
    radius: number,
    width: number,
    baseStrokeWidth: number
  ) {
    const pos = node.position();
    const cX = pos.x;
    const cY = pos.y;

    const strokeWidth = baseStrokeWidth * 2 * (violation ? 1.5 : 1);
    const offset = strokeWidth * 0.2;

    ctx.beginPath();
    ctx.arc(cX, cY, radius + strokeWidth - offset, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.setLineDash([]);
    ctx.lineWidth = strokeWidth * 1;
    ctx.strokeStyle = 'white';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cX, cY, radius + strokeWidth - offset, 0, 2 * Math.PI, false);
    ctx.closePath();

    ctx.setLineDash([10, 2]);
    if (violation && this.controller.getSettings(true).animate) {
      ctx.lineDashOffset = this.dashAnimationOffset;
    } else {
      ctx.lineDashOffset = 0;
    }
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = violation ? 'rgb(184, 36, 36)' : '#37872d';

    ctx.stroke();

    // inner
    ctx.beginPath();
    ctx.arc(cX, cY, radius - width - baseStrokeWidth, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = violation ? 'rgb(184, 36, 36)' : '#37872d';
    ctx.fill();
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
    var yPos = pos.y + node.height() * 0.8;

    if (node.data().type === 'PARENT') {
      if (node.data().layer >= this.controller.state.controller.state.currentLayer || node.data().layer === undefined) {
      } else {
        yPos = pos.y + node.height() * 0.5 + 30;
      }
    }

    const { showBaselines } = this.controller.getSettings(true);
    const metrics: IntGraphMetrics = node.data('metrics');
    const responseTime = _.defaultTo(metrics.response_time, -1);
    const threshold = _.defaultTo(metrics.threshold, -1);

    if (!showBaselines || threshold < 0 || responseTime < 0 || responseTime <= threshold) {
      ctx.fillStyle = this.colors.default;
    } else {
      ctx.fillStyle = '#FF7383';
    }

    ctx.fillRect(xPos - labelPadding, yPos - 6 - labelPadding, labelWidth + 2 * labelPadding, 6 + 2 * labelPadding);

    ctx.fillStyle = this.colors.background;
    ctx.fillText(label, xPos, yPos);
  }

  _drawDebugInformation() {
    const ctx = this.context;

    this.frameCounter++;

    ctx.font = '12px monospace';
    ctx.fillStyle = 'white';
    ctx.fillText('Frames per Second: ' + this.fpsCounter, 10, 12);
    ctx.fillText('Particles: ' + this.particleEngine.count(), 10, 24);
  }

  _drawDonut(
    ctx: CanvasRenderingContext2D,
    node: cytoscape.NodeSingular,
    radius: number,
    width: number,
    strokeWidth: number,
    percentages: number[]
  ) {
    const cX = node.position().x;
    const cY = node.position().y;
    let currentArc = -Math.PI / 2; // offset

    ctx.beginPath();
    ctx.arc(cX, cY, radius + strokeWidth, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();

    const { healthyColor, dangerColor, noDataColor } = this.controller.getSettings(true).style;
    const colors = [dangerColor, noDataColor, healthyColor];
    for (let i = 0; i < percentages.length; i++) {
      let arc = this._drawArc(ctx, currentArc, cX, cY, radius, percentages[i], colors[i]);
      currentArc += arc;
    }

    ctx.beginPath();
    ctx.arc(cX, cY, radius - width, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'white';
    ctx.fill();

    // cut out an inner-circle == donut
    ctx.beginPath();
    ctx.arc(cX, cY, radius - width - strokeWidth, 0, 2 * Math.PI, false);
    if (node.selected()) {
      ctx.fillStyle = 'white';
    } else {
      ctx.fillStyle = this.colors.background;
    }
    ctx.fill();
  }

  _drawArc(
    ctx: CanvasRenderingContext2D,
    currentArc: number,
    cX: number,
    cY: number,
    radius: number,
    percent: number,
    color: string
  ) {
    // calc size of our wedge in radians
    var WedgeInRadians = (percent * 360 * Math.PI) / 180;
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
}
