(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-white shadow');
            } else {
                $('.fixed-top').removeClass('bg-white shadow');
            }
        } else {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-white shadow').css('top', -45);
            } else {
                $('.fixed-top').removeClass('bg-white shadow').css('top', 0);
            }
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Project carousel
    $(".project-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0: { items: 1 },
            576: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav: false,
        responsive: {
            0: { items: 1 },
            576: { items: 1 },
            768: { items: 2 },
            992: { items: 3 }
        }
    });


    // Services filter + search
    function initServiceFilter() {
        var $items = $('.service-item');

        if (!$items.length) {
            return;
        }

        function apply() {
            var cat = $('.filter-btn.active').attr('data-filter') || 'all';
            var q = $.trim($('#serviceSearch').val()).toLowerCase();
            var visible = 0;

            // Find loan titles that start with the search text.
            var $titleMatches = $();

            if (q) {
                $items.each(function () {
                    var $item = $(this);
                    var title = $.trim($item.find('h3').first().text()).toLowerCase();

                    if (title.indexOf(q) === 0) {
                        $titleMatches = $titleMatches.add($item);
                    }
                });
            }

            // If a title matches, prioritize matching titles.
            var prioritizeTitle = q && $titleMatches.length > 0;

            $items.each(function () {
                var $item = $(this);
                var cats = ($item.attr('data-category') || '').split(/\s+/);
                var title = $.trim($item.find('h3').first().text()).toLowerCase();
                var text = $item.text().toLowerCase();

                var okCat = cat === 'all' || $.inArray(cat, cats) !== -1;

                var okText;

                if (!q) {
                    okText = true;
                } else if (prioritizeTitle) {
                    okText = title.indexOf(q) === 0;
                } else {
                    okText = text.indexOf(q) !== -1;
                }

                var show = okCat && okText;

                if (show) {
                    visible++;

                    $item
                        .removeClass('d-none service-show wow fadeInUp')
                        .css({
                            'animation-delay': ((visible - 1) * 0.1) + 's',
                            'visibility': 'visible'
                        });

                    void $item[0].offsetWidth;   // restart the animation
                    $item.addClass('service-show');
                } else {
                    $item.addClass('d-none').removeClass('service-show');
                }
            });

            $('#serviceEmpty').toggleClass('d-none', visible !== 0);

            $('#serviceCount').text(
                visible + (visible === 1 ? ' loan shown' : ' loans shown')
            );
        }

        $('.filter-btn').off('click.serviceFilter').on('click.serviceFilter', function () {
            $('.filter-btn')
                .removeClass('active')
                .attr('aria-pressed', 'false');

            $(this)
                .addClass('active')
                .attr('aria-pressed', 'true');

            apply();
        });

        $('#serviceSearch')
            .off('input.serviceFilter')
            .on('input.serviceFilter', apply);

        $('#serviceClear')
            .off('click.serviceFilter')
            .on('click.serviceFilter', function () {
                $('#serviceSearch').val('');

                $('.filter-btn')
                    .removeClass('active')
                    .attr('aria-pressed', 'false');

                $('.filter-btn[data-filter="all"]')
                    .addClass('active')
                    .attr('aria-pressed', 'true');

                apply();
            });

        apply();
    }


    // Hero pill spotlight (FIX: guard against missing element so the rest of the script still runs)
    const pill = document.querySelector('.hero-subtitle');
    if (pill) {
        pill.addEventListener('mousemove', e => {
            const r = pill.getBoundingClientRect();
            pill.style.setProperty('--x', (e.clientX - r.left) + 'px');
            pill.style.setProperty('--y', (e.clientY - r.top) + 'px');
        });
    }


    // Boot
    $(function () {
        initServiceFilter();
    });


    // Team carousel
    (() => {
        const track = document.getElementById("teamTrack");
        if (!track) return;

        const advisors = [
            {
                name: "Ananya Sen", role: "Chief Investment Advisor", dept: "Wealth Management", exp: "18 years", email: "ananya@example.com",
                bio: "Leads portfolio strategy for long-term clients, with a focus on retirement planning and tax-efficient investing.", photo: ""
            },
            {
                name: "Rohan Mukherjee", role: "Senior Tax Consultant", dept: "Taxation", exp: "12 years", email: "rohan@example.com",
                bio: "Advises individuals and small businesses on tax planning, filings and compliance.", photo: ""
            },
            {
                name: "Priya Banerjee", role: "Risk Analyst", dept: "Risk & Compliance", exp: "9 years", email: "priya@example.com",
                bio: "Reviews portfolios for risk exposure and helps clients build resilient, diversified plans.", photo: ""
            },
            {
                name: "Arjun Das", role: "Estate Planning Lead", dept: "Legal Advisory", exp: "15 years", email: "arjun@example.com",
                bio: "Guides families through wills, trusts and succession planning with clear, practical advice.", photo: ""
            },
            {
                name: "Meera Chatterjee", role: "Insurance Specialist", dept: "Protection", exp: "10 years", email: "meera@example.com",
                bio: "Helps clients choose life, health and property cover that fits their goals and budget.", photo: ""
            },
            {
                name: "Sourav Ghosh", role: "Retirement Planner", dept: "Wealth Management", exp: "14 years", email: "sourav@example.com",
                bio: "Designs income plans for retirees and those approaching retirement.", photo: ""
            }
        ];

        const tones = [ // [accent, tint]
            ["#2563eb", "#dbeafe"], ["#0d9488", "#ccfbf1"], ["#c2410c", "#ffedd5"],
            ["#7c3aed", "#ede9fe"], ["#be185d", "#fce7f3"], ["#4d7c0f", "#ecfccb"]
        ];

        /* ---------- BUILD CARDS ---------- */
        const initials = n => n.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
        const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
        const avatarHTML = a => a.photo ? `<img src="${esc(a.photo)}" alt="">` : esc(initials(a.name));

        function makeCard(a, i, isClone) {
            const [tone, tint] = tones[i % tones.length];
            const el = document.createElement("button");
            el.type = "button";
            el.className = "teams-card";
            el.style.setProperty("--tone", tone);
            el.style.setProperty("--tint", tint);
            el.dataset.index = i;
            if (isClone) { el.tabIndex = -1; el.setAttribute("aria-hidden", "true"); }
            else { el.setAttribute("role", "listitem"); }
            el.innerHTML = `
      <div class="teams-card__photo">
        <span class="teams-card__exp">${esc(a.exp)}</span>
        <div class="teams-card__avatar">${avatarHTML(a)}</div>
      </div>
      <div class="teams-card__body">
        <h3 class="teams-card__name">${esc(a.name)}</h3>
        <p class="teams-card__role">${esc(a.role)}</p>
        <span class="teams-card__dept">${esc(a.dept)}</span>
      </div>`;
            return el;
        }

        // 3 identical sets: [clone][real][clone] so we can always wrap invisibly
        for (let set = 0; set < 3; set++) {
            advisors.forEach((a, i) => track.appendChild(makeCard(a, i, set !== 1)));
        }

        /* ---------- INFINITE SCROLL ---------- */
        const SPEED = 0.45;               // px per frame (~27px/s at 60fps)
        const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
        let setW = 0, pos = 0, paused = reduceMotion, hover = false, dragging = false, animating = false;

        function measure() {
            const cards = track.children, n = advisors.length;
            setW = cards[n].offsetLeft - cards[0].offsetLeft;   // width of one full set incl. gaps
            track.scrollLeft = pos = setW;                       // start at the middle (real) set
        }

        function wrap() {
            if (!setW) return;
            if (track.scrollLeft >= setW * 2) { track.scrollLeft -= setW; pos = track.scrollLeft; }
            else if (track.scrollLeft < 1) { track.scrollLeft += setW; pos = track.scrollLeft; }
        }

        function tick() {
            if (!paused && !hover && !dragging && !animating && !document.hidden) {
                pos += SPEED;
                track.scrollLeft = pos;
            } else {
                pos = track.scrollLeft;      // stay in sync with manual scrolling
            }
            wrap();
            requestAnimationFrame(tick);
        }

        track.addEventListener("scroll", wrap, { passive: true });

        // and never un-fired, so auto-scroll stopped forever.
        track.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") hover = true; });
        track.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") hover = false; });
        // card, which left auto-scroll paused indefinitely.
        track.addEventListener("focusin", e => { if (e.target.matches(":focus-visible")) hover = true; });
        track.addEventListener("focusout", () => hover = false);

        /* Touch swipe is native; mouse drag below */
        let startX = 0, startLeft = 0, moved = 0, pressing = false;

        track.addEventListener("pointerdown", e => {
            moved = 0;
            if (e.pointerType !== "mouse") return;
            pressing = true;
            startX = e.clientX;
            startLeft = track.scrollLeft;
        });
        track.addEventListener("pointermove", e => {
            if (!pressing) return;
            const dx = e.clientX - startX;
            moved = Math.abs(dx);
            // Capturing on pointerdown retargets the click to the track, so card clicks never worked.
            if (!dragging && moved > 5) {
                dragging = true;
                track.classList.add("is-dragging");
                try { track.setPointerCapture(e.pointerId); } catch (_) { }
            }
            if (dragging) track.scrollLeft = startLeft - dx;
        });
        const endDrag = e => {
            pressing = false;
            if (!dragging) return;
            dragging = false;
            track.classList.remove("is-dragging");
            try { track.releasePointerCapture(e.pointerId); } catch (_) { }
        };
        track.addEventListener("pointerup", endDrag);
        track.addEventListener("pointercancel", endDrag);

        /* Arrow buttons: smooth step of one card, loop stays seamless */
        function step(dir) {
            const cards = track.children;
            const amount = (cards[1].offsetLeft - cards[0].offsetLeft) * dir;
            animating = true;
            track.scrollBy({ left: amount, behavior: reduceMotion ? "auto" : "smooth" });
            clearTimeout(step.t);
            step.t = setTimeout(() => { animating = false; pos = track.scrollLeft; }, 450);
        }
        const prevBtn = document.getElementById("teamPrev");
        const nextBtn = document.getElementById("teamNext");
        if (prevBtn) prevBtn.addEventListener("click", () => step(-1));
        if (nextBtn) nextBtn.addEventListener("click", () => step(1));

        /* Keyboard: arrows move the carousel when a card has focus */
        track.addEventListener("keydown", e => {
            if (e.key === "ArrowRight") { step(1); }
            if (e.key === "ArrowLeft") { step(-1); }
        });

        /* ---------- MODAL ---------- */
        const modalEl = document.getElementById("profileModal");
        const modal = modalEl ? bootstrap.Modal.getOrCreateInstance(modalEl) : null;

        track.addEventListener("click", e => {
            const card = e.target.closest(".teams-card");
            if (!card || moved > 5 || !modal) return;     // ignore clicks that were really drags
            const a = advisors[+card.dataset.index];
            document.getElementById("modalAvatar").innerHTML = avatarHTML(a);
            document.getElementById("modalName").textContent = a.name;
            document.getElementById("modalRole").textContent = a.role;
            document.getElementById("modalDeptBadge").textContent = a.dept;
            document.getElementById("modalExp").textContent = a.exp;
            document.getElementById("modalBio").textContent = a.bio;
            document.getElementById("modalEmailBtn").href = "mailto:" + a.email;
            modal.show();
        });

        // Pause the auto-scroll while the modal is open
        if (modalEl) {
            modalEl.addEventListener("show.bs.modal", () => paused = true);
            modalEl.addEventListener("hidden.bs.modal", () => paused = reduceMotion);
        }

        /* ---------- START ---------- */
        const start = () => { measure(); requestAnimationFrame(tick); };
        if (document.readyState === "complete") start();
        else window.addEventListener("load", start);

        window.addEventListener("resize", () => {
            const r = track.scrollLeft / (setW || 1);
            measure();
            track.scrollLeft = pos = r * setW;
        });
    })();

})(jQuery);
