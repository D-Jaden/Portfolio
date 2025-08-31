document.addEventListener('DOMContentLoaded', () => {


    // Initialize GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(ScrollToPlugin);

    //==================
    //LOADING SCREEN
    //==================
    const greetings = [
        { text: "Hello", lang: "English" },
        { text: "नमस्ते", lang: "हिंदी" },
        { text: "Hola", lang: "Español" },
        { text: "Bonjour", lang: "Français" },
        { text: "你好", lang: "中文" },
        { text: "こんにちは", lang: "日本語" }
    ];
    let currentIndex = 0;
    const helloText = document.getElementById('hello-text');
    const languageIndicator = document.getElementById('language-indicator');
    const loader = document.getElementById('loader');
    const progressBar = document.getElementById('progress-bar');
    // Apple-style smooth transitions
    function showGreeting(index) {
        const greeting = greetings[index];
        const progress = ((index + 1) / greetings.length) * 100;
        // Minimal fade transition
        const tl = gsap.timeline();
        
        tl.to([helloText, languageIndicator], {
            opacity: 0,
            y: -10,
            duration: 0.3,
            ease: "power2.inOut"
        })
        .call(() => {
            helloText.textContent = greeting.text;
            languageIndicator.textContent = greeting.lang;
        })
        .to([helloText, languageIndicator], {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.1
        })
        .to(progressBar, {
            width: progress + '%',
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.3");
        currentIndex++;
        
        if (currentIndex < greetings.length) {
            setTimeout(() => showGreeting(currentIndex), 1000);
        } else {
            setTimeout(finishLoading, 800);
        }
    }
    // Clean loading completion
    function finishLoading() {
        const exitTl = gsap.timeline();
        
        exitTl
            .to(progressBar, {
                width: '100%',
                duration: 0.3,
                ease: "power2.out"
            })
            .to([helloText, languageIndicator], {
                opacity: 0,
                y: -20,
                duration: 0.4,
                ease: "power2.inOut"
            })
            .to('.spinner', {
                opacity: 0,
                scale: 0.8,
                duration: 0.3,
                ease: "power2.inOut"
            }, "-=0.2")
            .to('.progress-container', {
                opacity: 0,
                duration: 0.3,
                ease: "power2.inOut"
            }, "-=0.1")
            .to(loader, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    loader.style.display = 'none';
                    revealContent();
                }
            }, "+=0.2");
    }
    // Apple-style content revelation
    function revealContent() {
        document.body.style.overflow = 'auto';
        
        const revealTl = gsap.timeline({
            defaults: {
                duration: 0.8,
                ease: "power2.out"
            }
        });
        
        revealTl
            .to('.navigation-bar', {
                opacity: 1,
                y: 0,
                duration: 0.6
            })
            .to('#home', {
                opacity: 1,
                duration: 1
            }, "-=0.4")
            .to('#text', {
                opacity: 1,
                y: 0,
                duration: 0.8
            }, "-=0.6")
            .to('.subtitle', {
                opacity: 1,
                y: 0,
                duration: 0.6
            }, "-=0.4")
            .to('.image-container', {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power2.out"
            }, "-=0.4");
    }
    // Initialize loader sequence
    function startLoader() {
        document.body.style.overflow = 'hidden';
        
        // Initial state
        gsap.set([helloText, languageIndicator], { opacity: 0, y: 10 });
        
        // Start sequence
        setTimeout(() => {
            // Show spinner first
            gsap.to('.spinner', {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out"
            });
            
            // Start greeting sequence
            setTimeout(() => showGreeting(0), 600);
        }, 300);
    }
    document.querySelectorAll(".navigation-bar a").forEach(anchor => {
      anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetEl = document.querySelector(targetId);
    
        // Distance to scroll
        const distance = Math.abs(targetEl.getBoundingClientRect().top);
    
        // Dynamic duration: shorter if closer
        const duration = Math.min(0.8, distance / 1500); // tweak divisor
    
        gsap.to(window, {
          duration: duration,
          scrollTo: targetId,
          ease: "power1.out"
        });
      });
    });
    //==============================
    // Navigation smooth scroll
    //==============================
    document.querySelectorAll(".navigation-bar a").forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            
            gsap.to(window, {
                duration: 0.8,
                scrollTo: {
                    y: targetId,
                    offsetY: 60
                },
                ease: "power2.inOut"
            });
        });
    });

    // Start everything when page loads
    window.addEventListener('load', startLoader);


    // Text animation for hero section
    const element1 = document.querySelector('#text');
    const originalText = element1.textContent;

    function splitText() {
        element1.innerHTML = '';
        for (let i = 0; i < originalText.length; i++) {
            const char = originalText[i];
            const span = document.createElement('span');
            span.className = 'char';
            if (char === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = char;
            }
            element1.appendChild(span);
        }
        gsap.set(element1, { opacity: 1 });
        animateText();
    }
    
    function animateText() {
        gsap.set(".char", { 
            y: 115,
            opacity: 0
        });
        
       gsap.to(".char", {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.05,
            ease: "back.out(1.2)",
            scrollTrigger: {
                trigger: element1,
                start: "top 80%",
                toggleActions: "restart reset restart reset"
            }
        });
    }
    
    splitText();

    //==========================
    //SCRAMBLED TEXT ANIMATION
    //==========================

    // GSAP und ScrambleTextPlugin registrieren
    gsap.registerPlugin(ScrambleTextPlugin);

    // Ziel-Element
    const scrambleElement = document.querySelector(".scramble-text");

    // Originaltext speichern
    const ogText = scrambleElement.textContent;

    // Scramble-Animation bei Hover
    scrambleElement.addEventListener("mouseenter", () => {
      gsap.to(scrambleElement, {
        duration: 0.9, 
        scrambleText: {
          text: ogText, 
          characters: "10010001100101110110011011001101111100000", 
          speed: 1, 
          revealDelay: 0.9,  
          delimiter: " ", 
          tweenLength: false, 
        },
        ease: "power3.out", 
      });
    });

    //===========================
    //HIGHLISGHTS
    //==========================
    gsap.utils.toArray(".text-highlight").forEach((highlight, index) => {
        gsap.fromTo(
            highlight,
            {
                backgroundColor: "transparent",
            },
            {
                backgroundColor: "rgba(255, 255, 0, 0.79)", 
                duration: 0.5,
                ease: "power4.inOut",
                scrollTrigger: {
                    trigger: highlight,
                    start: "top 80%", 
                    end: "top 50%",   
                    toggleActions: "play none none reverse", 
                    markers: false, 
                },
                delay: index * 0.2 
            }
        );
    });
       gsap.utils.toArray(".text-highlight-desc").forEach((highlight, index) => {
        gsap.fromTo(
            highlight,
            {
                backgroundColor: "transparent",
            },
            {
                backgroundColor: "rgba(255, 183, 0, 0.79)", 
                duration: 0.5,
                ease: "power4.inOut",
                scrollTrigger: {
                    trigger: highlight,
                    start: "top 80%", 
                    end: "top 50%",   
                    toggleActions: "play none none reverse", 
                    markers: false, 
                },
                delay: index * 0.2 
            }
        );
    });

    //==========================
    //ABOUT SECTION ANIMATION
    //==========================

    gsap.fromTo(".about", 
        {
            opacity: 0,
            y: 100
        },
        {
            opacity: 1,
            y: 0,
            duration: 2,
            stagger:0.05,
            ease: "bounce.out",
            scrollTrigger: {
                trigger: ".about-section",
                start: "top 70%",
                toggleActions: "restart reset restart restart"
            },
        }
    );

    const words = ["Student","Researcher","Full Stack Developer","Designer","Algorithm Enthusiast","Linux User & Enthusiast","Open Source Contributer","Photographer"];
    let cursor = gsap.to(".cursor", {
        opacity: 0,
        ease: Power2.inOut,
        repeat: -1
    });

    let boxTL = gsap.timeline({
    scrollTrigger: {
        trigger: ".about",
        start: "top 80%", 
        end: "top 50%",
        toggleActions: "play none none restart"
        }
    });
    boxTL.to(".box", {
        duration: 1,
        width: "5.5vw",
        delay: 0.5,
        ease: "power4.inOut"
    })
    .to(".box", {
        duration: 1,
        height: "5vw",
        ease: "elastic.out",
    })
    .to(".hi", {
        duration: 1,
        y: 0,         
        opacity: 1,    
        ease: "power3.out",
        onComplete: () => masterTL.play()
    })
    .to(".box", {
        duration: 2,
        autoAlpha: 0.7,
        yoyo: true,
        repeat: -1
    });

    let masterTL = gsap.timeline({repeat:-1}).pause()
    words.forEach(word => {
        let tl = gsap.timeline({repeat:1,yoyo:true,repeatDelay:1});
        tl.to('.text', {duration:1,text:word}) 
        masterTL.add(tl);   
    })

    // Horizontal scrolling setup
    const horizontalContainer = document.querySelector('.horizontal-container');
    const horizontalContent = document.querySelector('.horizontal-content');
    const panels = document.querySelectorAll('.horizontal-content .panel');
    
    //=====

   // Progress indicator function - shows dots at bottom for navigation
    const createProgressIndicator = () => {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'timeline-progress';
        progressContainer.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.3);
            padding: 10px 20px;
            border-radius: 25px;
            backdrop-filter: blur(10px);
        `;
        
        // Create a dot for each panel
        panels.forEach((panel, index) => {
            const dot = document.createElement('div');
            dot.className = `progress-dot progress-dot-${index}`;
            dot.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transition: all 0.3s ease;
                cursor: pointer;
            `;

            // Add click functionality to jump to specific panel
            dot.addEventListener('click', () => {
                const targetX = -index * window.innerWidth * 0.8;
                gsap.to(horizontalContent, {
                    x: targetX,
                    duration: 1,
                    ease: "power2.inOut"
                });
            });

            progressContainer.appendChild(dot);
        });

        document.body.appendChild(progressContainer);

        // Update progress indicator based on scroll position
        ScrollTrigger.create({
            trigger: horizontalContainer,
            start: "top top",
            end: () => `+=${horizontalContent.scrollWidth - window.innerWidth}`,
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                const activeIndex = Math.floor(progress * panels.length);

                // Update dot appearance based on current position
                document.querySelectorAll('.progress-dot').forEach((dot, index) => {
                    if (index <= activeIndex) {
                        dot.style.background = 'white';
                        dot.style.transform = 'scale(1.2)';
                    } else {
                        dot.style.background = 'rgba(255, 255, 255, 0.3)';
                        dot.style.transform = 'scale(1)';
                    }
                });
            }
        });
    };

    // Initialize the progress indicator
    createProgressIndicator();
    //======================
    //CUBE ANIMATION
    //======================

    const n = 13
    const rots = [
      { ry: 270, a:0.5 },
      { ry: 0,   a:0.85 },
      { ry: 90,  a:0.4 },
      { ry: 180, a:0.0 }
    ]

    // Initialize cube animation for both panel-5 and panel-6
    function initializeCubeAnimation(selector) {
        const container = document.querySelector(selector);
        if (!container) return;

        const faces = container.querySelectorAll(".face");
        gsap.set(faces, {
            z: 200,
            rotateY: i => rots[i].ry,
            transformOrigin: "50% 50% -201px"
        });

        for (let i=0; i<n; i++){
            let die = container.querySelector('.die')
            let cube = die.querySelector('.cube')
        
            if (i>0){    
                let clone = container.querySelector('.die').cloneNode(true);
                container.querySelector('.tray').append(clone);
                cube = clone.querySelector('.cube')
            }

            gsap.timeline({repeat:-1, yoyo:true, defaults:{ease:'power3.inOut', duration:1}})
            .fromTo(cube, {
                rotateY:-90
            },{
                rotateY:90,
                ease:'power1.inOut',
                duration:2
            })
            .fromTo(cube.querySelectorAll('.face'), {
                color: 'hsl(0, 0%, 100%)'
            }, {
                color: 'hsl(0, 0%, 100%)'
            }, 0)
            .to(cube.querySelectorAll('.face'), {
                color: 'hsl(0, 0%, 100%)'
            }, 1)
            .progress(i/n)
        }

        gsap.timeline()
            .from(container.querySelector('.tray'), {yPercent:-3, duration:2, ease:'power1.inOut', yoyo:true, repeat:-1}, 0)
            .fromTo(container.querySelector('.tray'), {rotate:-15},{rotate:15, duration:4, ease:'power1.inOut', yoyo:true, repeat:-1}, 0)
            .from(container.querySelectorAll('.die'), {duration:0.01, opacity:0, stagger:{each:-0.05, ease:'power1.in'}}, 0)
            .to(container.querySelector('.tray'), {scale:1.2, duration:2, ease:'power3.inOut', yoyo:true, repeat:-1}, 0)
    }

    // Initialize cubes for both panels
    initializeCubeAnimation('.panel-5');
    initializeCubeAnimation('.panel-6');

    window.onload = window.onresize = ()=> {
        const h = n*56
        document.querySelectorAll('.tray').forEach(tray => {
            gsap.set(tray, {height:h})
        });
        document.querySelectorAll('.pov').forEach(pov => {
            gsap.set(pov, {scale:innerHeight/h})
        });
    }

    if (horizontalContainer && horizontalContent && panels.length > 0) {
        // Calculate total scroll distance (only for horizontal panels, excluding panel-6)
        const getScrollAmount = () => {
            let totalWidth = 0;
            panels.forEach(panel => {
                totalWidth += panel.offsetWidth;
            });
            return -(totalWidth - window.innerWidth);
        };
        
        // Create horizontal scroll animation
        const horizontalTween = gsap.to(horizontalContent, {
            x: getScrollAmount,
            duration: 3,
            ease: "none",
        });
        
        ScrollTrigger.create({
            trigger: horizontalContainer,
            start: "top top",
            end: () => `+=${Math.abs(getScrollAmount())}`,
            pin: true,
            animation: horizontalTween,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1
        });

        // Animate panel content as they come into view
        panels.forEach((panel, index) => {
            const content = panel.querySelector('.panel-content');
            
            // Set initial state
            gsap.set(content, {
                opacity: 0,
                y: 100,
                scale: 0.8
            });
            
            // Create animation for each panel
            ScrollTrigger.create({
                trigger: panel,
                start: "left 80%",
                end: "right 20%",
                containerAnimation: horizontalTween,
                onEnter: () => {
                    gsap.to(content, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1,
                        ease: "power3.out"
                    });
                },
                onLeave: () => {
                    gsap.to(content, {
                        opacity: 0.3,
                        scale: 0.95,
                        duration: 0.5,
                        ease: "power2.inOut"
                    });
                },
                onEnterBack: () => {
                    gsap.to(content, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: "power3.out"
                    });
                },
                onLeaveBack: () => {
                    gsap.to(content, {
                        opacity: 0.3,
                        scale: 0.95,
                        duration: 0.5,
                        ease: "power2.inOut"
                    });
                }
            });
            
            // Special animations for different panel types
            if (panel.classList.contains('panel-autobhasha')) {
                // Skills animation
                const skillItems = panel.querySelectorAll('.skill-item');
                gsap.set(skillItems, { opacity: 0, y: 30 });
                
                ScrollTrigger.create({
                    trigger: panel,
                    start: "left 60%",
                    containerAnimation: horizontalTween,
                    onEnter: () => {
                        gsap.to(skillItems, {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            stagger: 0.1,
                            delay: 0.3,
                            ease: "back.out(1.7)"
                        });
                    }
                });
            }
            if (panel.classList.contains('panel-sams')) {
                // Skills animation
                const skillItems = panel.querySelectorAll('.skill-item');
                gsap.set(skillItems, { opacity: 0, y: 30 });
                
                ScrollTrigger.create({
                    trigger: panel,
                    start: "left 60%",
                    containerAnimation: horizontalTween,
                    onEnter: () => {
                        gsap.to(skillItems, {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            stagger: 0.1,
                            delay: 0.3,
                            ease: "back.out(1.7)"
                        });
                    }
                });
            }
            
            if (panel.classList.contains('panel-tetris')) {
                // Skills animation
                const skillItems = panel.querySelectorAll('.skill-item');
                gsap.set(skillItems, { opacity: 0, y: 30 });
                
                ScrollTrigger.create({
                    trigger: panel,
                    start: "left 60%",
                    containerAnimation: horizontalTween,
                    onEnter: () => {
                        gsap.to(skillItems, {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            stagger: 0.1,
                            delay: 0.3,
                            ease: "back.out(1.7)"
                        });
                    }
                });
            }

            if (panel.classList.contains('panel-globe')) {
                // Skills animation
                const skillItems = panel.querySelectorAll('.skill-item');
                gsap.set(skillItems, { opacity: 0, y: 30 });
                
                ScrollTrigger.create({
                    trigger: panel,
                    start: "left 60%",
                    containerAnimation: horizontalTween,
                    onEnter: () => {
                        gsap.to(skillItems, {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            stagger: 0.1,
                            delay: 0.3,
                            ease: "back.out(1.7)"
                        });
                    }
                });
            }

            if (panel.classList.contains('panel-2')) {
                // Skills animation
                const skillItems = panel.querySelectorAll('.skill-item');
                gsap.set(skillItems, { opacity: 0, y: 30 });
                
                ScrollTrigger.create({
                    trigger: panel,
                    start: "left 60%",
                    containerAnimation: horizontalTween,
                    onEnter: () => {
                        gsap.to(skillItems, {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            stagger: 0.1,
                            delay: 0.3,
                            ease: "back.out(1.7)"
                        });
                    }
                });
            }
            
            if (panel.classList.contains('panel-4')) {
                // Philosophy animation
                const principles = panel.querySelectorAll('.principle');
                gsap.set(principles, { opacity: 0, scale: 0.8, y: 40 });
                
                ScrollTrigger.create({
                    trigger: panel,
                    start: "left 60%",
                    containerAnimation: horizontalTween,
                    onEnter: () => {
                        gsap.to(principles, {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            duration: 0.7,
                            stagger: 0.15,
                            delay: 0.4,
                            ease: "back.out(1.4)"
                        });
                    }
                });
            }

            if (panel.classList.contains('panel-5')) {
                gsap.set(".panel-5 .panel-inner-left", {opacity: 0});
                // Blend animation within panel-5
                ScrollTrigger.create({
                    trigger: panel,
                    start: "left centre",
                    end: "right left",
                    containerAnimation: horizontalTween,
                    scrub: true,
                    onUpdate: (self) => {
                        gsap.to(".panel-5 .panel-inner-left", { opacity: 1 - self.progress });
                    }
                });
            }

        });
    }

    // Vertical transition animation for panel-6
    const verticalTransition = document.querySelector('.vertical-transition-container');
    const panel6 = document.querySelector('.panel-6');
    
    if (verticalTransition && panel6) {
        // Set initial state for panel-6
        gsap.set(".panel-6 .panel-content", {
            opacity: 0,
            y: 100,
            scale: 0.8
        });

        // Animate panel-6 content when it comes into view
        ScrollTrigger.create({
            trigger: verticalTransition,
            start: "top 80%",
            end: "bottom 20%",
            onEnter: () => {
                gsap.to(".panel-6 .panel-content", {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: "power3.out"
                });
                
                // Animate the cube in panel-6
                gsap.to(".panel-6 .panel-inner-center", {
                    opacity: 1,
                    scale: 1,
                    duration: 1.5,
                    ease: "power3.out",
                    delay: 0.3
                });
            },
            onLeave: () => {
                gsap.to(".panel-6 .panel-content", {
                    opacity: 0.7,
                    scale: 0.95,
                    duration: 0.6,
                    ease: "power2.out"
                });
            },
            onEnterBack: () => {
                gsap.to(".panel-6 .panel-content", {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: "power3.out"
                });
            }
        });

        // Create seamless transition from horizontal to vertical
        ScrollTrigger.create({
            trigger: verticalTransition,
            start: "top bottom",
            end: "top center",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                // Smooth transition effect
                gsap.to(".panel-6", {
                    y: -50 * progress,
                    duration: 0.3,
                    ease: "none"
                });
            }
        });
    }

    //==================================
    //PHOTOGRAPHY SECTION ZOOM SCROLL
    //==================================
    
    // Simple photography section JavaScript - no zoom or parallax effects

    const photoPanels = document.querySelectorAll('.photo-panel');
    
    // Simple fade-in animation for content when panels come into view
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const content = entry.target.querySelector('.photo-content');
            if (entry.isIntersecting) {
                // Panel is visible - show content
                if (content) {
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                }
            } else {
                // Panel is not visible - hide content
                if (content) {
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(30px)';
                }
            }
        });
    }, observerOptions);
    // Observe all photo panels
    photoPanels.forEach(panel => {
        observer.observe(panel);
    });
    
    // Timeline animations
    gsap.utils.toArray('.timeline-item').forEach((item, index) => {
        const marker = item.querySelector('.timeline-marker');
        const content = item.querySelector('.timeline-content');
        
        // Set initial states
        gsap.set(item, { opacity: 0, y: 100 });
        gsap.set(marker, { scale: 0 });
        
        // Create scroll trigger for timeline items
        ScrollTrigger.create({
            trigger: item,
            start: "top 85%",
            onEnter: () => {
                // Animate timeline item
                gsap.to(item, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out"
                });
                
                // Animate marker with bounce effect
                gsap.to(marker, {
                    scale: 1,
                    duration: 0.6,
                    ease: "back.out(2)",
                    delay: 0.3
                });
                
                // Add pulsing effect to marker
                gsap.to(marker, {
                    boxShadow: "0 0 30px rgba(255, 77, 90, 0.8)",
                    duration: 0.3,
                    delay: 0.8,
                    yoyo: true,
                    repeat: 1
                });
            },
            onLeave: () => {
                gsap.to(item, {
                    opacity: 0.7,
                    duration: 0.3
                });
            },
            onEnterBack: () => {
                gsap.to(item, {
                    opacity: 1,
                    duration: 0.3
                });
            }
        });
    });
    
    // Contact section animation
    gsap.fromTo(".contact-section h2", 
        {
            opacity: 0,
            y: 80,
            scale: 0.8
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".contact-section",
                start: "top 80%"
            }
        }
    );
    
    // Contact items animation
    gsap.utils.toArray('.contact-item').forEach((item, index) => {
        gsap.fromTo(item,
            {
                opacity: 0,
                y: 60,
                rotationY: -20
            },
            {
                opacity: 1,
                y: 0,
                rotationY: 0,
                duration: 0.8,
                delay: 0.2 + (index * 0.1),
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".contact-section",
                    start: "top 70%"
                }
            }
        );
        
    });
    
    // Smooth scrolling for navigation
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: {
                        y: targetElement,
                        offsetY: 80
                    },
                    ease: "power3.inOut"
                });
            }
        });
    });

    // Parallax effect for decorative elements
    gsap.to('.decorative-element', {
        y: -100,
        rotation: 10,
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });
    
    gsap.to('.decorative-element-2', {
        y: 100,
        rotation: -10,
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });
    
    // Hover animations for interactive elements
    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.05,
                rotationY: 5,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                rotationY: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Skill items hover effect
    document.querySelectorAll('.skill-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.1,
                rotation: 5,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Principles hover effect
    document.querySelectorAll('.principle').forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.1,
                rotation: -5,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power3.out"
            });
        });
    });
    
    // Photo panel hover effects
    document.querySelectorAll('.photo-panel').forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            gsap.to(panel, {
                scale: 1.02,
                duration: 0.6,
                ease: "power2.out"
            });
        });
        
        panel.addEventListener('mouseleave', () => {
            gsap.to(panel, {
                scale: 1,
                duration: 0.6,
                ease: "power2.out"
            });
        });
    });

    document.querySelectorAll('contact-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.1,
                rotation: 5,
                duration: 0.3,
                ease: "power3.out"
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power3.out"
            });
        });
    });
    
    // Handle window resize for horizontal scrolling
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });
    
    // Loading animation
    const loadingTl = gsap.timeline();
    loadingTl
        .set('body', { overflow: 'hidden' })
        .to('.decorative-element, .decorative-element-2', {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out"
        })
        .to('.navigation-bar', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        }, '-=0.5')
        .set('body', { overflow: 'auto' });
        
    // Initialize smooth scrollbar if needed
    ScrollTrigger.addEventListener("refresh", () => gsap.set("#home", {y: 0}));
    
    // Refresh ScrollTrigger after everything is loaded
    ScrollTrigger.refresh();

    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach((item, index) => {
    const isOdd = index % 2 === 0;
    gsap.fromTo(
        item.querySelector('.timeline-content'),
        {
            x: isOdd ? '-100%' : '100%', // Odd: slide from left, Even: slide from right
            opacity: 0
        },
        {
            x: '0%',
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 80%', // Trigger when top of item is 80% from top of viewport
                end: 'bottom 20%',
                toggleActions: 'play none none none' // Play animation once when entering
            }
        }
    );
});

    
});