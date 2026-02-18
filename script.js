// Card Data Source
const cardsData = [
    { "id": 1, "text": "當工作時間能彈性調整時", "category": "green" },
    { "id": 2, "text": "當我清楚知道目前優先順序時", "category": "green" },
    { "id": 3, "text": "當設定的目標與現況相符時", "category": "green" },
    { "id": 4, "text": "當我能選擇做事方式時", "category": "green" },
    { "id": 5, "text": "當工作節奏不被打亂時", "category": "green" },
    { "id": 6, "text": "當工作有清楚步驟，穩定推進時", "category": "green" },
    { "id": 7, "text": "當我對時間有掌握感與緩衝時", "category": "green" },
    { "id": 8, "text": "當任務有清楚聚焦的目標時", "category": "green" },
    { "id": 9, "text": "當交付內容與期待一致時", "category": "green" },
    { "id": 10, "text": "當我能及時得到回饋時", "category": "green" },
    { "id": 11, "text": "當我有決策能讓事情快速往前時", "category": "green" },
    { "id": 12, "text": "當任務規則、標準與範圍清楚時", "category": "green" },
    { "id": 13, "text": "當做事所需資源齊備時", "category": "green" },
    { "id": 14, "text": "當評估標準前後一致時", "category": "green" },
    { "id": 15, "text": "當後續步驟與預期結果清楚時", "category": "green" },
    { "id": 16, "text": "當我在合作中感到被支持時", "category": "red" },
    { "id": 17, "text": "當我能安心說出想法時", "category": "red" },
    { "id": 18, "text": "當彼此對事情的期待對齊時", "category": "red" },
    { "id": 19, "text": "當我在互動中感受到被尊重時", "category": "red" },
    { "id": 22, "text": "當我與他人關係良好時", "category": "red" },
    { "id": 23, "text": "當彼此清楚角色與責任時", "category": "red" },
    { "id": 24, "text": "當不同意見能被說出與討論時", "category": "red" },
    { "id": 25, "text": "當需要時有獲得夥伴支援時", "category": "red" },
    { "id": 26, "text": "當彼此的付出與回應是平衡時", "category": "red" },
    { "id": 27, "text": "當我不是獨自承擔所有責任時", "category": "red" },
    { "id": 20, "text": "當回饋讓人願意前進時", "category": "red" },
    { "id": 21, "text": "當我被信任處理重要任務時", "category": "red" },
    { "id": 28, "text": "當我相信自己能回應眼前狀況時", "category": "orange" },
    { "id": 29, "text": "當我對自己的判斷有基本信心時", "category": "orange" },
    { "id": 30, "text": "當我有空間專注在當下正在做的事時", "category": "orange" },
    { "id": 31, "text": "當我能在需要好好休息時", "category": "orange" },
    { "id": 32, "text": "當我能覺察情緒不被牽著走時", "category": "orange" },
    { "id": 33, "text": "當我辨識哪些責任屬於我，不過於承擔他人情緒時", "category": "orange" },
    { "id": 34, "text": "當我願意肯定自己的付出時", "category": "orange" },
    { "id": 35, "text": "當不同角色之間有切換的空間時", "category": "orange" },
    { "id": 36, "text": "當我可以發揮所長或專業時", "category": "orange" },
    { "id": 37, "text": "當我所做的事有貼合我的價值觀時", "category": "orange" }
];

// Configuration
const REQUIRED_MIN = 10;
const REQUIRED_MAX = 12;
const GAS_URL = "https://script.google.com/macros/s/AKfycbyMBq5IudyYYfU7KIShhIhx8SH1q0fKa2e41yC4DAtcijJSC1mzM8TmIfFlsMWTbtvM6g/exec";

// Application State
let selectedCards = new Set();

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    const cardGrid = document.getElementById('card-grid');
    const counterDisplay = document.getElementById('counter');
    const submitBtn = document.getElementById('submit-btn');
    const contextInput = document.getElementById('context');
    const roleInput = document.getElementById('role');
    const statusMessage = document.getElementById('status-message');

    // Initialize
    renderCards();
    updateCounter();

    // Render Function
    function renderCards() {
        cardGrid.innerHTML = ''; // Clear existing
        cardsData.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card', `category-${card.category}`);
            cardElement.dataset.id = card.id;
            cardElement.innerHTML = `<span>${card.text}</span>`;

            // Re-apply selection state if re-rendering
            if (selectedCards.has(card.id)) {
                cardElement.classList.add('selected');
            }

            cardElement.addEventListener('click', () => toggleCardSelection(card.id, cardElement));
            cardGrid.appendChild(cardElement);
        });
    }

    // Toggle Selection Logic
    function toggleCardSelection(id, element) {
        if (selectedCards.has(id)) {
            // Deselect
            selectedCards.delete(id);
            element.classList.remove('selected');
        } else {
            // Select
            if (selectedCards.size >= REQUIRED_MAX) {
                alert(`最多只能選擇 ${REQUIRED_MAX} 張牌卡！`);
                return;
            }
            selectedCards.add(id);
            element.classList.add('selected');
        }
        updateCounter();
    }

    // Update Counter UI
    function updateCounter() {
        const count = selectedCards.size;
        counterDisplay.textContent = `${count} / ${REQUIRED_MAX}`;

        // Dynamic styling via class
        if (count >= REQUIRED_MIN && count <= REQUIRED_MAX) {
            counterDisplay.classList.add('valid');
        } else {
            counterDisplay.classList.remove('valid');
        }
    }

    // Submit Handler
    submitBtn.addEventListener('click', async () => {
        const context = contextInput.value.trim();
        const role = roleInput.value.trim();
        const count = selectedCards.size;

        // Validation
        statusMessage.textContent = '';
        statusMessage.className = '';

        if (!context) {
            showStatus('請填寫「設定情境」欄位', 'error-msg');
            contextInput.focus();
            return;
        }
        if (!role) {
            showStatus('請填寫「設定角色」欄位', 'error-msg');
            roleInput.focus();
            return;
        }
        if (count < REQUIRED_MIN) {
            showStatus(`您目前只選擇了 ${count} 張牌卡，請至少選擇 ${REQUIRED_MIN} 張。`, 'error-msg');
            return;
        }
        if (count > REQUIRED_MAX) { // Should be prevented by toggle logic, but double check
            showStatus(`您選擇了太多牌卡，請減少至 ${REQUIRED_MAX} 張以內。`, 'error-msg');
            return;
        }

        // Prepare Data
        // Convert Set of IDs to Array of Text for submission (or IDs, user said "selected_cards (使用者選擇的牌卡陣列，請轉成字串存入)")
        // The GAS script expects an array or string.
        // It's better to store the text so it's readable in the sheet, or both.
        // Based on user prompt "selected_cards... please convert to string", the GAS does the join.
        // I will map IDs back to Text for better readability in the backend sheet.
        const selectedCardsText = Array.from(selectedCards).map(id => {
            return cardsData.find(c => c.id === id).text;
        });

        const payload = {
            context: context,
            role: role,
            selected_cards: selectedCardsText
        };

        // Send Data
        disableForm(true);
        showStatus('資料傳送中...', '');

        try {
            // Using no-cors/text-plain trick for GAS
            // However, since the GAS script returns JSON, we want to read it if possible.
            // But 'no-cors' mode makes the response opaque.
            // If the GAS script has proper CORS set (which I added in previous step: Access-Control-Allow-Origin: * is implied by the ContentService return if simpler request),
            // we might be able to use standard CORS.
            // Standard fetch to GAS requires 'redirect: follow'.

            const response = await fetch(GAS_URL, {
                method: 'POST',
                redirect: 'follow',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8' // Avoid preflight
                },
                body: JSON.stringify(payload)
            });

            // If we use 'text/plain', we don't trigger preflight, but we can't read JSON response easily if the server doesn't support it well?
            // Actually GAS handles text/plain POSTs well.
            // Since `redirect: follow` is used, we should get the final response.

            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    showStatus('傳送成功！感謝您的填寫。', 'success-msg');
                    // Optional: Reset form
                    // resetForm(); 
                } else {
                    showStatus('傳送失敗: ' + data.message, 'error-msg');
                }
            } else {
                showStatus('伺服器連線錯誤，請稍後再試。', 'error-msg');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            showStatus('發生錯誤: ' + error.message, 'error-msg');
        } finally {
            disableForm(false);
        }
    });

    function showStatus(msg, className) {
        statusMessage.textContent = msg;
        statusMessage.className = className;
    }

    function disableForm(disabled) {
        submitBtn.disabled = disabled;
        contextInput.disabled = disabled;
        roleInput.disabled = disabled;
        submitBtn.textContent = disabled ? 'SENDING...' : '送出資料 →';
    }

    // Reset Logic
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('確定要清除所有內容並重新填寫嗎？')) {
                // Clear inputs
                contextInput.value = '';
                roleInput.value = '';

                // Clear selection
                selectedCards.clear();
                document.querySelectorAll('.card.selected').forEach(el => {
                    el.classList.remove('selected');
                });

                // Update UI
                updateCounter();
                showStatus('', '');

                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
});
