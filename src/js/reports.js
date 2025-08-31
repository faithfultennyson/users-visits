import { isCardReported, markCardReported } from './state.js';
import { trackReportOpen, trackReportSubmit } from './analytics.js';

let activeCard = null;
const modal = document.getElementById('modal');
const menu = document.getElementById('menu');
const form = document.getElementById('reportForm');

function showMenu(card, button) {
    if (isCardReported(card.dataset.uid)) return;

    activeCard = card;
    card.appendChild(menu);
    menu.classList.add('visible');
    menu.style.top = `${button.offsetTop + button.offsetHeight + 8}px`;
    menu.style.right = '0.5rem';
    menu.style.left = '0.5rem';

    // Close menu when clicking outside the card
    const closeMenu = (e) => {
        if (!card.contains(e.target)) {
            menu.classList.remove('visible');
            document.removeEventListener('click', closeMenu);
        }
    };

    document.addEventListener('click', closeMenu);
}

function showModal(reason) {
    const uid = activeCard.dataset.uid;
    trackReportOpen(uid, reason);
    
    document.getElementById('reportUid').value = uid;
    document.getElementById('reportType').value = reason;
    
    modal.classList.add('visible');
    menu.classList.remove('visible');
}

function showSuccess() {
    const content = modal.querySelector('.modal-content');
    content.innerHTML = `
        <div class="success-message">
            <h2>✅ Thank you</h2>
            <p>Our team will review and take action.</p>
        </div>
    `;
    
    setTimeout(() => {
        modal.classList.remove('visible');
        // Reset form after animation
        setTimeout(() => {
            content.innerHTML = form.outerHTML;
        }, 300);
    }, 1100);
}

export function initializeReports() {
    // Set up menu button handlers
    document.addEventListener('click', e => {
        const dotBtn = e.target.closest('.dot-btn');
        if (dotBtn) {
            e.preventDefault();
            e.stopPropagation();
            const card = dotBtn.closest('.card');
            showMenu(card, dotBtn);
        }
    });

    // Set up menu item handlers
    menu.addEventListener('click', e => {
        const button = e.target.closest('button');
        if (button) {
            const reason = button.dataset.reason;
            showModal(reason);
        }
    });

    // Set up form submission
    modal.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const uid = formData.get('uid');
        const reason = formData.get('type');
        
        markCardReported(uid);
        trackReportSubmit(uid, reason);
        showSuccess();
    });

    // Close modal on backdrop click or escape
    modal.addEventListener('click', e => {
        if (e.target === modal || e.target.classList.contains('btn-cancel')) {
            modal.classList.remove('visible');
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            modal.classList.remove('visible');
            menu.classList.remove('visible');
        }
    });
}
