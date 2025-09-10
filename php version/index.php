<?php
$profilePath = __DIR__ . '/../config/profile.json';
$linksPath = __DIR__ . '/../config/links.json';
$profile = json_decode(file_get_contents($profilePath), true);
$links = json_decode(file_get_contents($linksPath), true);
function e($str) { return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8'); }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($profile['handle'] ?? 'CreatorGrid') ?> — Your Creative Space</title>
    <meta name="theme-color" content="<?= e($profile['colors']['page_bg'] ?? '#000000') ?>">
    <meta name="color-scheme" content="dark">
    <link rel="stylesheet" href="../src/css/tokens.css">
    <link rel="stylesheet" href="../src/css/styles.css">
    <style>
        :root {
            --brand-primary: <?= e($profile['brand']['primary'] ?? '#26C6DA') ?>;
            --brand-secondary: <?= e($profile['brand']['secondary'] ?? '#4361EE') ?>;
            --brand-tertiary: <?= e($profile['brand']['tertiary'] ?? '#3A0CA3') ?>;
            --page-bg: <?= e($profile['colors']['page_bg'] ?? '#121212') ?>;
        }
    </style>
</head>
<body>
<header class="header h1">
    <div class="header-content">
        <div class="branding">
            <?php $logo = $profile['assets']['favicon']['png32'] ?? ''; ?>
            <img id="logo" src="<?= e($logo) ?>" alt="">
            <span id="handle"><?= e($profile['handle']) ?></span>
        </div>
        <nav class="header-links">
            <?php foreach ($links['header']['quick'] ?? [] as $link): ?>
                <a href="<?= e($link['href']) ?>" aria-label="<?= e($link['aria']) ?>">
                    <img src="<?= e(($links['icons']['base_path'] ?? '') . $link['icon'] . '.svg') ?>" alt="">
                </a>
            <?php endforeach; ?>
        </nav>
        <button id="hamburger" aria-controls="hamburgerMenu" aria-expanded="false" aria-label="Menu">☰</button>
    </div>
    <div id="hamburgerMenu" role="menu" aria-hidden="true">
        <button class="close-menu" aria-label="Close menu">✕</button>
        <div class="menu-links">
            <?php foreach ($links['header']['overflow'] ?? [] as $link): ?>
                <a href="<?= e($link['href']) ?>" title="<?= e($link['title']) ?>" aria-label="<?= e($link['aria']) ?>">
                    <img src="<?= e(($links['icons']['base_path'] ?? '') . $link['icon'] . '.svg') ?>" alt="">
                    <span><?= e($link['title']) ?></span>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
</header>
<div class="description style-1 align-<?= e($profile['layout']['description_align'] ?? 'center') ?>" data-sticky="<?= !empty($profile['description']['sticky']) ? 'true' : 'false' ?>">
    <h1><?= e($profile['description']['title']) ?></h1>
    <p><?= e($profile['description']['body']) ?></p>
    <?php if (!empty($profile['description']['marketing_link']['show'])): ?>
        <a href="/signup" class="create-link"><em><?= e($profile['description']['marketing_link']['text']) ?></em></a>
    <?php endif; ?>
</div>
<div id="social-cta" class="filters" role="tablist" hidden></div>
<main id="grid" class="grid" aria-live="polite"></main>
<footer class="footer">
    <div class="footer-links">
        <?php foreach ($links['footer']['icons'] ?? [] as $icon): ?>
            <a href="<?= e($icon['href']) ?>" aria-label="<?= e($icon['aria']) ?>">
                <img src="<?= e(($links['icons']['base_path'] ?? '') . $icon['icon'] . '.svg') ?>" alt="">
            </a>
        <?php endforeach; ?>
        <?php foreach ($links['footer']['text_links'] ?? [] as $text): ?>
            <?php if (!isset($text['show']) || $text['show']): ?>
                <a href="<?= e($text['href']) ?>"><?= e($text['label']) ?></a>
            <?php endif; ?>
        <?php endforeach; ?>
    </div>
    <div class="footer-legal"><?= e($links['footer']['disclaimer'] ?? '') ?></div>
    <div class="copyright">&copy; <?= date('Y') ?> <?= e($profile['handle']) ?></div>
</footer>
<script>
window.profileData = <?= json_encode($profile, JSON_UNESCAPED_SLASHES) ?>;
window.linksData = <?= json_encode($links, JSON_UNESCAPED_SLASHES) ?>;
</script>
<script type="module" src="../src/js/main.js"></script>
</body>
</html>
