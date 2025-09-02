import { isCardReported, markCardReported } from './state.js';
import { trackReportOpen, trackReportSubmit } from './analytics.js';

let activeCard = null;
let activeMenu = null;
let activeButton = null;
const modal = document.getElementById('modal');
const menu = document.getElementById('menu');
const form = document.getElementById('reportForm');

function showMenu(card, button) {
    // If clicking the same button, toggle the menu
    if (activeButton === button) {
        hideMenu();
        return;
    }

    // Hide any previously open menu
    hideMenu();

    // Show new menu
    activeCard = card;
    activeMenu = menu;
    activeButton = button;

    // Position menu below button
    const rect = button.getBoundingClientRect();
    const menuWidth = menu.offsetWidth || 150; // Default width if not yet rendered
    
    // Calculate position to keep menu within viewport
    let left = rect.left + window.scrollX - menuWidth + rect.width;
    let top = rect.bottom + window.scrollY + 5;

    // Adjust if menu would go off screen
    if (left < 0) left = 0;
    if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 5;
    }

    // Apply position
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
    
    // Show menu and update accessibility
    menu.classList.add('visible');
    menu.setAttribute('aria-hidden', 'false');
    button.setAttribute('aria-expanded', 'true');
}

// Close menu function
function hideMenu() {
    if (activeMenu) {
        activeMenu.classList.remove('visible');
        activeMenu.setAttribute('aria-hidden', 'true');
        if (activeButton) {
            activeButton.setAttribute('aria-expanded', 'false');
        }
        activeMenu = null;
        activeButton = null;
    }
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
            e.stopPropagation();  // Stop click from reaching the card
            e.preventDefault();   // Prevent default button behavior
            const reason = button.dataset.reason;
            showModal(reason);
        }
    });

    // Set up form submission
    modal.addEventListener('submit', e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const reportData = {
            uid: formData.get('uid'),
            type: formData.get('type'),
            message: formData.get('message'),
            contact: {
                name: formData.get('name') || null,
                email: formData.get('email') || null
            }
        };
        
        markCardReported(reportData.uid);
        trackReportSubmit(reportData.uid, reportData);
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
