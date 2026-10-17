const advisors = [
    {
        name: "Anita Sengupta",
        role: "Chief Executive Officer",
        specialization: "Executive Management",
        dept: "leadership",
        deptLabel: "Leadership",
        image: "",
        email: "anita@trueline.example",
        experience: "22 years in retail lending",
        biography: "Anita co-founded Trueline in 2017 after leading a regional bank's personal loan division. She still reads a sample of loan summaries every week to check they are clear.",
        social: { facebook: "#", twitter: "#", instagram: "#" },
        featured: false
    },
    {
        name: "Rohan Mehta",
        role: "Head of Lending",
        specialization: "Credit & Underwriting",
        dept: "lending",
        deptLabel: "Lending",
        image: "",
        email: "rohan@trueline.example",
        experience: "15 years in credit and underwriting",
        biography: "Rohan designs our loan products and approval policies. He believes a good loan is one the borrower can repay comfortably, not the largest one they qualify for.",
        social: { facebook: "#", twitter: "#", instagram: "#" },
        featured: false
    },
    {
        name: "Farah Khan",
        role: "Chief Risk Officer",
        specialization: "Risk & Compliance",
        dept: "risk",
        deptLabel: "Risk",
        image: "",
        email: "farah@trueline.example",
        experience: "18 years in risk and compliance",
        biography: "Farah leads credit risk and regulatory compliance. She built our fair-lending checks so that every application is assessed on the same criteria.",
        social: { facebook: "#", twitter: "#", instagram: "#" },
        featured: false
    },
    {
        name: "Debashis Roy",
        role: "Business Loans Manager",
        specialization: "Small Business Finance",
        dept: "lending",
        deptLabel: "Lending",
        image: "",
        email: "debashis@trueline.example",
        experience: "12 years in small business finance",
        biography: "Debashis grew up in his family's hardware shop and now helps owners of small businesses plan loans around their real cash flow, including slow seasons.",
        social: { facebook: "#", twitter: "#", instagram: "#" },
        featured: false
    },
    {
        name: "Priya Nair",
        role: "Customer Support Lead",
        specialization: "Customer Relations",
        dept: "support",
        deptLabel: "Support",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        email: "priya@trueline.example",
        experience: "10 years in customer service",
        biography: "Priya leads the team that answers your calls and emails. Her goal is that no borrower has to explain their problem twice.",
        social: { facebook: "#", twitter: "#", instagram: "#" },
        featured: false
    },
    {
        name: "Karan Malhotra",
        role: "Senior Credit Analyst",
        specialization: "Credit Analysis",
        dept: "risk",
        deptLabel: "Risk",
        image: "",
        email: "karan@trueline.example",
        experience: "9 years in credit analysis",
        biography: "Karan reviews applications that need a second look. When a case is borderline, he looks for what would make it work before he looks for a reason to decline.",
        social: { facebook: "#", twitter: "#", instagram: "#" },
        featured: false
    },
    {
        name: "Meera Iyer",
        role: "Home Loan Advisor",
        specialization: "Housing Finance",
        dept: "lending",
        deptLabel: "Lending",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
        email: "meera@trueline.example",
        experience: "8 years in housing finance",
        biography: "Meera guides first-time buyers through property checks, paperwork and the repayment plan. She keeps a checklist for every home loan so nothing is missed.",
        social: { facebook: "#", twitter: "#", instagram: "#" },
        featured: false
    },
    {
        name: "Sourav Das",
        role: "Repayment Support Officer",
        specialization: "Loan Servicing",
        dept: "support",
        deptLabel: "Support",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        email: "sourav@trueline.example",
        experience: "7 years in loan servicing",
        biography: "Sourav helps borrowers who are finding payments difficult. He sets up revised schedules and explains what each option means for the loan before anything changes.",
        social: { facebook: "#", twitter: "#", instagram: "#" },
        featured: false
    }
];

// ---------- Helpers ----------
const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

const getInitials = name => String(name || '')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

document.addEventListener('DOMContentLoaded', function () {
    const directoryContainer = document.getElementById('directoryTeamContainer');
    if (!directoryContainer) return;

    if (!document.getElementById('team-directory-styles')) {
        const style = document.createElement('style');
        style.id = 'team-directory-styles';
        style.textContent = '.hidden-item { display: none !important; }';
        document.head.appendChild(style);
    }

    directoryContainer.innerHTML = advisors.map(adv => {
        const name = escapeHtml(adv.name);
        const role = escapeHtml(adv.role);
        const dept = escapeHtml(adv.dept);
        const deptLabel = escapeHtml(adv.deptLabel);
        const exp = escapeHtml(adv.experience);
        const email = escapeHtml(adv.email);
        const image = escapeHtml(adv.image);
        const bio = escapeHtml(adv.biography);

        const avatarContent = adv.image
            ? `<img src="${image}" alt="${name}" class="w-100 h-100 object-fit-cover">`
            : escapeHtml(getInitials(adv.name));

        return `
                <div class="col-sm-6 col-lg-3 py-1 team-item" data-dept="${dept}">
                    <article class="team-card card-elevated">
                        <div>
                            <div class="avatar dept-${dept} overflow-hidden d-flex align-items-center justify-content-center" aria-hidden="true">${avatarContent}</div>
                            <h3 class="h5 fw-bold mb-1">${name}</h3>
                            <div class="text-sky-600 fw-medium small mb-3">${role}</div>
                        </div>
                        <div class="actions d-flex gap-2 justify-content-center mt-3 pt-3 border-top">
                            <button type="button" class="btn btn-sm btn-harbor px-2 flex-grow-1"
                                data-bs-toggle="modal"
                                data-bs-target="#profileModal"
                                data-name="${name}"
                                data-role="${role}"
                                data-dept="${dept}"
                                data-dept-label="${deptLabel}"
                                data-exp="${exp}"
                                data-email="${email}"
                                data-image="${image}"
                                data-bio="${bio}">View profile</button>
                            <a class="btn btn-sm btn-outline-harbor p-2" href="mailto:${email}" aria-label="Email ${name}"><i class="bi bi-envelope"></i></a>
                        </div>
                    </article>
                </div>
              `;
    }).join('');

    // Fall back to initials if a card image fails to load
    directoryContainer.querySelectorAll('.avatar img').forEach(img => {
        img.addEventListener('error', () => img.replaceWith(getInitials(img.alt)));
    });

    // ---------- Department filtering ----------
    const filterButtons = document.querySelectorAll('.team-filter');
    const teamItems = document.querySelectorAll('.team-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');

            const selectedDept = this.getAttribute('data-dept');

            teamItems.forEach(item => {
                const itemDept = item.getAttribute('data-dept');
                if (selectedDept === 'all' || itemDept === selectedDept) {
                    item.classList.remove('hidden-item');
                } else {
                    item.classList.add('hidden-item');
                }
            });
        });
    });

    // ---------- Profile modal ----------
    const profileModal = document.getElementById('profileModal');
    if (profileModal) {
        profileModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            if (!button) return; 

            const name = button.getAttribute('data-name') || '';
            const role = button.getAttribute('data-role') || '';
            const dept = button.getAttribute('data-dept') || '';
            const deptLabel = button.getAttribute('data-dept-label') || '';
            const exp = button.getAttribute('data-exp') || '';
            const email = button.getAttribute('data-email') || '';
            const image = button.getAttribute('data-image') || '';
            const bio = button.getAttribute('data-bio') || '';

            document.getElementById('modalName').textContent = name;
            document.getElementById('modalRole').textContent = role;
            document.getElementById('modalExp').textContent = exp;
            document.getElementById('modalBio').textContent = bio;
            document.getElementById('modalEmailBtn').href = 'mailto:' + email;
            document.getElementById('modalDeptBadge').textContent = deptLabel;

            const modalAvatar = document.getElementById('modalAvatar');
            const showInitials = () => {
                modalAvatar.textContent = getInitials(name);
                modalAvatar.className = 'avatar me-3 mb-0 dept-' + dept + ' w-100 h-100 d-flex align-items-center justify-content-center';
            };

            if (image.trim() !== '') {
                const img = document.createElement('img');
                img.src = image;
                img.alt = name;
                img.className = 'w-100 h-100 object-fit-cover';
                img.addEventListener('error', showInitials);
                modalAvatar.replaceChildren(img);
                modalAvatar.className = 'w-100 h-100 d-flex align-items-center justify-content-center overflow-hidden';
            } else {
                showInitials();
            }
        });
    }
});
