class PerfectCandle {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.candle = document.querySelector('.candle-container');
        this.wick = document.querySelector('.wick');
        this.particles = [];
        this.meltDrops = [];
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.handleWind(e));
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        const rect = this.candle.getBoundingClientRect();
        this.flameBaseX = rect.left + rect.width / 2;
        this.flameBaseY = rect.top + 30;
        this.meltStartY = rect.top + rect.height - 100;
    }

    handleWind(e) {
        this.wind = (e.clientX - this.flameBaseX) * 0.0013;
    }

    createFlameParticle() {
        return {
            x: this.flameBaseX,
            y: this.flameBaseY,
            size: Math.random() * 4 + 5,
            life: 1.5,
            velX: (Math.random() - 0.5) * 0.2 + this.wind,
            velY: -(Math.random() * 0.6 + 0.4),
            color: `hsla(${30 + Math.random() * 10}, 100%, 60%, ${0.7 + Math.random() * 0.3})`
        };
    }

    createMeltDrop() {
        if (Math.random() < 0.1) {
            this.meltDrops.push({
                x: this.flameBaseX - 15 + Math.random() * 10,
                y: this.meltStartY,
                size: Math.random() * 2 + 2,
                speed: Math.random() * 1 - 0.09
            });
        }
    }

    updatePhysics() {
        // Flame particles
        this.particles.forEach((p, i) => {
            p.x += p.velX;
            p.y += p.velY;
            p.velX *= 0.97;
            p.velY += 0.015;
            p.life -= 0.02;
            p.size *= 0.98;
            if (p.life <= 0) this.particles.splice(i, 1);
        });

        // Melt drops
        this.meltDrops.forEach((d, i) => {
            d.y += d.speed;
            d.speed *= 0.70;
            if (d.y > this.canvas.height) this.meltDrops.splice(i, 1);
        });
    }

    drawGlow() {
        const gradient = this.ctx.createRadialGradient(
            this.flameBaseX, this.flameBaseY, 0,
            this.flameBaseX, this.flameBaseY, 120
        );
        gradient.addColorStop(0, 'rgba(255, 120, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 60, 0, 0)');

        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.flameBaseX, this.flameBaseY, 120, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dynamic glow
        this.drawGlow();

        // Flame particles
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life * 0.8;
            this.ctx.fill();
        });

        // Melt drops
        this.meltDrops.forEach(d => {
            this.ctx.beginPath();
            this.ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(208, 138, 90, ${1 - (d.y / this.canvas.height)})`;
            this.ctx.fill();
        });
    }

    animate() {
        this.particles.push(this.createFlameParticle());
        this.particles.push(this.createFlameParticle());
        this.createMeltDrop();
        this.updatePhysics();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

new PerfectCandle();