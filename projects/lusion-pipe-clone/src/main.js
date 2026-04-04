import * as THREE from 'three';
import { updateCameraIntrisics } from './utils/utils.js';
import VideoPanelShader from './videoPanelShader.js';

export class VideoPanelIntegration {
    frustumSize = 10;
    
    constructor() {
        this.initThree();
        this.videoPanel = new VideoPanelShader(this.camera);
        this.scene.add(this.videoPanel);

        window.addEventListener('resize', this.onWindowResized);
        window.addEventListener('scroll', this.onScroll);
        
        // Initial setup
        this.onWindowResized();
        this.onScroll();
    }
    
    initThree() {
        // We will mount this on the existing video-canvas-overlay
        const canvas = document.getElementById('video-canvas-overlay');
        if (!canvas) {
            console.error('video-canvas-overlay not found');
            return;
        }
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(this.animate);
        
        this.camera = new THREE.OrthographicCamera();
        this.camera.near = 0;
        this.camera.far = 1000;
        this.camera.position.z = 10;
        updateCameraIntrisics(this.camera, this.frustumSize);

        this.scene = new THREE.Scene();
    }
    
    onScroll = () => {
        this.camera.position.y = -window.scrollY / window.innerHeight * this.frustumSize;
    }
    
    onWindowResized = () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        updateCameraIntrisics(this.camera, this.frustumSize);
        if (this.videoPanel) this.videoPanel.resize();
    }
    
    animate = () => {
        if (this.videoPanel) this.videoPanel.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Ensure the module starts cleanly
window.addEventListener('DOMContentLoaded', () => {
    window.videoPanelIntegration = new VideoPanelIntegration();
});
