document.addEventListener('DOMContentLoaded', function() {
    const tonConnectBtn = document.getElementById('tonConnectBtn');
    const walletInfo = document.getElementById('walletInfo');
    const walletAddress = document.getElementById('walletAddress');
    const disconnectBtn = document.getElementById('disconnectBtn');

    // Инициализация TonConnect
    const connector = new TonConnect.TonConnect({
        manifestUrl: 'https://ton-connect.github.io/demo-dapp/tonconnect-manifest.json'
    });

    // Проверяем, подключен ли уже кошелек
    if (connector.connected) {
        updateUI(connector.account);
    }

    // Обработчик кнопки подключения
    tonConnectBtn.addEventListener('click', async () => {
        if (connector.connected) return;

        const wallets = await connector.getWallets();
        const wallet = wallets[0]; // Выбираем первый доступный кошелек (например, TonKeeper)

        try {
            await connector.connect({ jsBridgeKey: wallet.jsBridgeKey });
        } catch (err) {
            console.error("Connection error:", err);
            alert("Failed to connect wallet");
        }
    });

    // Обработчик отключения
    disconnectBtn.addEventListener('click', () => {
        connector.disconnect();
        walletInfo.style.display = 'none';
        tonConnectBtn.style.display = 'flex';
    });

    // Обновляем UI при изменении состояния
    connector.onStatusChange((wallet) => {
        if (wallet) {
            updateUI(wallet);
        } else {
            walletInfo.style.display = 'none';
            tonConnectBtn.style.display = 'flex';
        }
    });

    function updateUI(wallet) {
        walletAddress.textContent = wallet.address;
        walletInfo.style.display = 'block';
        tonConnectBtn.style.display = 'none';
    }
});