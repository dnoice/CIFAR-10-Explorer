
/**
 * CIFAR-10 Nexus - Accessible Dataset Explorer
 * Version: 4.0.0
 * Focus: Accessibility & Cross-Compatibility
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    /**
     * Configuration
     * =============
     */
    const CONFIG = {
        // Categories with their associated data
        categories: [
            { name: 'airplane', icon: 'fas fa-plane', trainCount: 5000, testCount: 1000, color: '#3b82f6' },
            { name: 'automobile', icon: 'fas fa-car', trainCount: 5000, testCount: 1000, color: '#ef4444' },
            { name: 'bird', icon: 'fas fa-dove', trainCount: 5000, testCount: 1000, color: '#10b981' },
            { name: 'cat', icon: 'fas fa-cat', trainCount: 5000, testCount: 1000, color: '#f59e0b' },
            { name: 'deer', icon: 'fas fa-deer', trainCount: 5000, testCount: 1000, color: '#8b5cf6' },
            { name: 'dog', icon: 'fas fa-dog', trainCount: 5000, testCount: 1000, color: '#ec4899' },
            { name: 'frog', icon: 'fas fa-frog', trainCount: 5000, testCount: 1000, color: '#14b8a6' },
            { name: 'horse', icon: 'fas fa-horse', trainCount: 5000, testCount: 1000, color: '#a16207' },
            { name: 'ship', icon: 'fas fa-ship', trainCount: 5000, testCount: 1000, color: '#0ea5e9' },
            { name: 'truck', icon: 'fas fa-truck', trainCount: 5000, testCount: 1000, color: '#64748b' }
        ],
        // Model architectures with detailed information
        modelArchitectures: {
            cnn: {
                name: 'Convolutional Neural Network',
                description: 'A basic CNN with 3 convolutional layers. Good for beginners and quick experiments.',
                parameters: 1285642,
                baseAccuracy: 0.82,
                size: '4.9 MB',
                trainingTime: '5-10 minutes',
                layers: [
                    { type: 'Conv2D', filters: 32, kernelSize: '3x3', activation: 'ReLU' },
                    { type: 'MaxPooling2D', size: '2x2' },
                    { type: 'Conv2D', filters: 64, kernelSize: '3x3', activation: 'ReLU' },
                    { type: 'MaxPooling2D', size: '2x2' },
                    { type: 'Conv2D', filters: 64, kernelSize: '3x3', activation: 'ReLU' },
                    { type: 'Flatten' },
                    { type: 'Dense', units: 64, activation: 'ReLU' },
                    { type: 'Dense', units: 10, activation: 'Softmax' }
                ]
            },
            resnet: {
                name: 'ResNet-18',
                description: 'A residual network architecture with skip connections for better gradient flow during training.',
                parameters: 11689512,
                baseAccuracy: 0.89,
                size: '44.6 MB',
                trainingTime: '15-20 minutes',
                layers: [
                    { type: 'Conv2D', filters: 64, kernelSize: '7x7', stride: 2, activation: 'ReLU' },
                    { type: 'MaxPooling2D', size: '3x3', stride: 2 },
                    { type: 'ResBlock', filters: 64, blocks: 2 },
                    { type: 'ResBlock', filters: 128, blocks: 2, downsample: true },
                    { type: 'ResBlock', filters: 256, blocks: 2, downsample: true },
                    { type: 'ResBlock', filters: 512, blocks: 2, downsample: true },
                    { type: 'GlobalAvgPool' },
                    { type: 'Dense', units: 10, activation: 'Softmax' }
                ]
            },
            mobilenet: {
                name: 'MobileNetV2',
                description: 'A lightweight architecture designed for mobile and edge devices with depthwise separable convolutions.',
                parameters: 2257984,
                baseAccuracy: 0.87,
                size: '8.6 MB',
                trainingTime: '8-12 minutes',
                layers: [
                    { type: 'Conv2D', filters: 32, kernelSize: '3x3', stride: 2, activation: 'ReLU6' },
                    { type: 'InvertedResBlock', filters: 16, expansion: 1, stride: 1 },
                    { type: 'InvertedResBlock', filters: 24, expansion: 6, stride: 2, blocks: 2 },
                    { type: 'InvertedResBlock', filters: 32, expansion: 6, stride: 2, blocks: 3 },
                    { type: 'InvertedResBlock', filters: 64, expansion: 6, stride: 2, blocks: 4 },
                    { type: 'InvertedResBlock', filters: 96, expansion: 6, stride: 1, blocks: 3 },
                    { type: 'InvertedResBlock', filters: 160, expansion: 6, stride: 2, blocks: 3 },
                    { type: 'InvertedResBlock', filters: 320, expansion: 6, stride: 1 },
                    { type: 'Conv2D', filters: 1280, kernelSize: '1x1', activation: 'ReLU6' },
                    { type: 'GlobalAvgPool' },
                    { type: 'Dense', units: 10, activation: 'Softmax' }
                ]
            },
            efficientnet: {
                name: 'EfficientNet-B0',
                description: 'A scalable architecture that uniformly scales all dimensions of depth/width/resolution using compound coefficient.',
                parameters: 5330564,
                baseAccuracy: 0.91,
                size: '20.3 MB',
                trainingTime: '12-18 minutes',
                layers: [
                    { type: 'Conv2D', filters: 32, kernelSize: '3x3', stride: 2, activation: 'Swish' },
                    { type: 'MBConvBlock', filters: 16, expansion: 1, kernelSize: '3x3', repeats: 1 },
                    { type: 'MBConvBlock', filters: 24, expansion: 6, kernelSize: '3x3', repeats: 2, stride: 2 },
                    { type: 'MBConvBlock', filters: 40, expansion: 6, kernelSize: '5x5', repeats: 2, stride: 2 },
                    { type: 'MBConvBlock', filters: 80, expansion: 6, kernelSize: '3x3', repeats: 3, stride: 2 },
                    { type: 'MBConvBlock', filters: 112, expansion: 6, kernelSize: '5x5', repeats: 3 },
                    { type: 'MBConvBlock', filters: 192, expansion: 6, kernelSize: '5x5', repeats: 4, stride: 2 },
                    { type: 'MBConvBlock', filters: 320, expansion: 6, kernelSize: '3x3', repeats: 1 },
                    { type: 'Conv2D', filters: 1280, kernelSize: '1x1', activation: 'Swish' },
                    { type: 'GlobalAvgPool' },
                    { type: 'Dense', units: 10, activation: 'Softmax' }
                ]
            }
        },
        // Chart configurations for consistent styling
        chartColors: {
            primary: '#6366f1',
            secondary: '#ec4899',
            accent: '#8b5cf6',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#0ea5e9',
            gray: '#64748b'
        },
        chartDefaults: {
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 12,
            fontColor: '#64748b',
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        },
        // Storage keys for persistent data
        storage: {
            prefix: 'cifar10nexus_',
            keys: {
                models: 'models',
                theme: 'theme',
                language: 'language',
                a11ySettings: 'a11ySettings',
                viewedCategories: 'viewedCategories',
                selectedCategory: 'selectedCategory'
            }
        },
        // Default accessibility settings
        defaultA11ySettings: {
            textSize: 1, // 1 = normal, 0.9 = small, 1.1 = large
            highContrast: false,
            reduceMotion: false,
            enhancedFocus: false,
            verboseAnnouncements: true
        }
    };

    /**
     * Element References
     * =================
     */
    const DOM = {
        // Core application containers
        app: document.getElementById('app'),
        loadingScreen: document.getElementById('loading-screen'),
        mainContent: document.getElementById('main-content'),
        
        // Navigation elements
        menuToggle: document.getElementById('menu-toggle'),
        primaryNavigation: document.getElementById('primary-navigation'),
        navItems: document.querySelectorAll('.nav-item a'),
        
        // Section containers
        contentSections: document.querySelectorAll('.content-section'),
        
        // Theme and accessibility controls
        themeToggle: document.getElementById('theme-toggle'),
        a11yToggle: document.getElementById('a11y-toggle'),
        a11yPanel: document.getElementById('a11y-panel'),
        
        // Language selector
        languageButton: document.getElementById('language-button'),
        languageMenu: document.getElementById('language-menu'),
        languageOptions: document.querySelectorAll('#language-menu [role="option"]'),
        
        // Dashboard elements
        dashboardTabs: document.querySelectorAll('[data-tab]'),
        categoryContainer: document.getElementById('tab-train-panel'),
        testCategoryContainer: document.getElementById('tab-test-panel'),
        statCounters: document.querySelectorAll('.stat-value[data-count]'),
        
        // Dataset browser elements
        categorySearch: document.getElementById('category-search'),
        categoryList: document.getElementById('category-list'),
        imagesGrid: document.getElementById('images-grid'),
        sortSelect: document.getElementById('sort-select'),
        viewToggles: document.querySelectorAll('.view-toggle'),
        imageCount: document.getElementById('image-count'),
        selectionCount: document.getElementById('selection-count'),
        downloadSelected: document.getElementById('download-selected'),
        prevPage: document.getElementById('prev-page'),
        nextPage: document.getElementById('next-page'),
        pageIndicator: document.getElementById('page-indicator'),
        
        // Training form elements
        modelType: document.getElementById('model-type'),
        batchSize: document.getElementById('batch-size'),
        epochsRange: document.getElementById('epochs-range'),
        epochs: document.getElementById('epochs'),
        learningRate: document.getElementById('learning-rate'),
        augFlip: document.getElementById('aug-flip'),
        augRotation: document.getElementById('aug-rotation'),
        augShift: document.getElementById('aug-shift'),
        augZoom: document.getElementById('aug-zoom'),
        advancedOptionsBtn: document.getElementById('advanced-options-btn'),
        advancedOptionsSection: document.getElementById('advanced-options-section'),
        modelInfo: document.getElementById('model-info'),
        resetFormBtn: document.getElementById('reset-form-btn'),
        startTrainingBtn: document.getElementById('start-training-btn'),
        
        // Training progress elements
        trainingProgressContainer: document.getElementById('training-progress-container'),
        trainingTime: document.getElementById('training-time'),
        currentEpoch: document.getElementById('current-epoch'),
        currentAccuracy: document.getElementById('current-accuracy'),
        trainingEta: document.getElementById('training-eta'),
        trainingProgressBar: document.getElementById('training-progress-bar'),
        progressPercentage: document.getElementById('progress-percentage'),
        trainingLog: document.getElementById('training-log'),
        accuracyChart: document.getElementById('accuracy-chart'),
        lossChart: document.getElementById('loss-chart'),
        cancelTrainingBtn: document.getElementById('cancel-training-btn'),
        pauseTrainingBtn: document.getElementById('pause-training-btn'),
        
        // Models display
        modelsContainer: document.getElementById('models-container'),
        emptyModels: document.getElementById('empty-models'),
        modelsFilterBtn: document.getElementById('models-filter-btn'),
        modelsSortBtn: document.getElementById('models-sort-btn'),
        
        // Analytics charts
        comparisonChart: document.getElementById('comparison-chart'),
        modelSelectorAccuracy: document.getElementById('model-selector-accuracy'),
        classAccuracyChart: document.getElementById('class-accuracy-chart'),
        modelSelectorConfusion: document.getElementById('model-selector-confusion'),
        confusionMatrix: document.getElementById('confusion-matrix'),
        modelSelectorHistory: document.getElementById('model-selector-history'),
        trainingHistoryChart: document.getElementById('training-history-chart'),
        modelSelectorResource: document.getElementById('model-selector-resource'),
        resourceUsageChart: document.getElementById('resource-usage-chart'),
        
        // Documentation elements
        docsSearch: document.getElementById('docs-search-input'),
        docsNav: document.querySelector('.docs-nav'),
        
        // Modals
        modals: document.querySelectorAll('.modal'),
        modalCloseBtns: document.querySelectorAll('.modal-close, .modal-close-btn'),
        imageViewerModal: document.getElementById('image-viewer-modal'),
        showcaseImage: document.getElementById('showcase-image'),
        imageCategory: document.getElementById('image-category'),
        imageSet: document.getElementById('image-set'),
        downloadImageBtn: document.getElementById('download-image-btn'),
        modelDetailsModal: document.getElementById('model-details-modal'),
        modelDetailsTitle: document.getElementById('model-details-title'),
        modelDetailsContent: document.getElementById('model-details-content'),
        viewAnalyticsBtn: document.getElementById('view-analytics-btn'),
        
        // Accessibility panel elements
        textDecrease: document.getElementById('text-decrease'),
        textReset: document.getElementById('text-reset'),
        textIncrease: document.getElementById('text-increase'),
        contrastOptions: document.querySelectorAll('input[name="contrast"]'),
        reduceMotion: document.getElementById('reduce-motion'),
        enhanceFocus: document.getElementById('enhance-focus'),
        verboseAnnouncements: document.getElementById('verbose-announcements'),
        saveA11yBtn: document.getElementById('save-a11y'),
        
        // Announcer for screen readers
        announcer: document.getElementById('announcer'),
        
        // Toast container for notifications
        toastContainer: document.getElementById('toast-container'),
        
        // Data refresh button
        refreshData: document.getElementById('refresh-data')
    };

    /**
     * Application State
     * ================
     */
    const STATE = {
        currentSection: 'dashboard',
        currentSet: 'train',
        currentCategory: null,
        currentPage: 1,
        itemsPerPage: 12,
        selectedImages: [],
        darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        language: 'en',
        a11ySettings: { ...CONFIG.defaultA11ySettings },
        dataLoaded: false,
        viewedCategories: [],
        sortOrder: 'name-asc',
        viewMode: 'grid',
        training: {
            inProgress: false,
            paused: false,
            progress: 0,
            currentEpoch: 0,
            totalEpochs: 10,
            startTime: null,
            elapsedTime: 0,
            logs: [],
            metrics: {
                trainAccuracy: [],
                valAccuracy: [],
                trainLoss: [],
                valLoss: []
            }
        },
        models: [],
        charts: {},
        toasts: []
    };

    /**
     * Initialization
     * =============
     */
    function initializeApp() {
        // Load saved state from local storage
        loadStoredState();
        
        // Apply theme based on saved preference or system preference
        applyTheme();
        
        // Apply accessibility settings
        applyA11ySettings();
        
        // Initialize navigation
        setupNavigation();
        
        // Set up event listeners
        setupEventListeners();
        
        // Load any saved models
        loadSavedModels();
        
        // Load categories
        renderCategories();
        initializeCategoryList();
        
        // Set up tabs
        initializeTabs();
        
        // Initialize form handlers
        initializeForms();
        
        // Animate stat counters
        animateStatCounters();
        
        // Initialize charts if available
        initializeCharts();
        
        // Hide loading screen
        setTimeout(() => {
            if (DOM.loadingScreen) {
                DOM.loadingScreen.classList.add('loaded');
                announceScreenReader('Application loaded and ready to use.');
            }
            STATE.dataLoaded = true;
        }, 1500);
    }

    /**
     * State Management
     * ===============
     */
    function loadStoredState() {
        // Load theme preference
        const storedTheme = getFromStorage(CONFIG.storage.keys.theme);
        if (storedTheme !== null) {
            STATE.darkMode = storedTheme === 'dark';
        }
        
        // Load language preference
        const storedLanguage = getFromStorage(CONFIG.storage.keys.language);
        if (storedLanguage) {
            STATE.language = storedLanguage;
        }
        
        // Load accessibility settings
        const storedA11ySettings = getFromStorage(CONFIG.storage.keys.a11ySettings);
        if (storedA11ySettings) {
            STATE.a11ySettings = { 
                ...CONFIG.defaultA11ySettings, 
                ...storedA11ySettings 
            };
        }
        
        // Load viewed categories
        const viewedCategories = getFromStorage(CONFIG.storage.keys.viewedCategories);
        if (viewedCategories) {
            STATE.viewedCategories = viewedCategories;
        }
        
        // Load selected category
        const selectedCategory = getFromStorage(CONFIG.storage.keys.selectedCategory);
        if (selectedCategory) {
            STATE.currentCategory = selectedCategory;
        }
    }

    function saveToStorage(key, value) {
        try {
            const fullKey = CONFIG.storage.prefix + key;
            localStorage.setItem(fullKey, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    function getFromStorage(key) {
        try {
            const fullKey = CONFIG.storage.prefix + key;
            const value = localStorage.getItem(fullKey);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    /**
     * Theme Handling
     * =============
     */
    function applyTheme() {
        // Add appropriate class to body
        document.body.classList.toggle('dark-mode', STATE.darkMode);
        document.body.classList.toggle('light-mode', !STATE.darkMode);
        
        // Update theme toggle button
        if (DOM.themeToggle) {
            DOM.themeToggle.setAttribute('aria-pressed', STATE.darkMode.toString());
            DOM.themeToggle.innerHTML = STATE.darkMode ? 
                '<i class="fas fa-sun" aria-hidden="true"></i><span class="sr-only">Light Mode</span>' : 
                '<i class="fas fa-moon" aria-hidden="true"></i><span class="sr-only">Dark Mode</span>';
        }
    }

    function toggleTheme() {
        STATE.darkMode = !STATE.darkMode;
        applyTheme();
        saveToStorage(CONFIG.storage.keys.theme, STATE.darkMode ? 'dark' : 'light');
        
        // Show toast notification
        showToast({
            title: STATE.darkMode ? 'Dark Mode Enabled' : 'Light Mode Enabled',
            message: STATE.darkMode ? 
                'The interface is now using dark mode colors.' : 
                'The interface is now using light mode colors.',
            type: 'info'
        });
        
        // Announce to screen readers
        announceScreenReader(STATE.darkMode ? 'Dark mode enabled.' : 'Light mode enabled.');
    }

    /**
     * Accessibility Features
     * =====================
     */
    function applyA11ySettings() {
        // Apply text size
        document.documentElement.style.fontSize = `${STATE.a11ySettings.textSize * 100}%`;
        
        // Apply high contrast if enabled
        document.body.classList.toggle('high-contrast', STATE.a11ySettings.highContrast);
        
        // Apply reduced motion if enabled
        document.body.classList.toggle('reduce-motion', STATE.a11ySettings.reduceMotion);
        
        // Apply enhanced focus if enabled
        document.body.classList.toggle('enhance-focus', STATE.a11ySettings.enhanceFocus);
        
        // Update a11y panel controls to reflect current settings
        updateA11yPanelControls();
    }

    function updateA11yPanelControls() {
        // Skip if panel doesn't exist
        if (!DOM.a11yPanel) return;
        
        // Update contrast radio buttons
        DOM.contrastOptions.forEach(option => {
            option.checked = (option.value === 'high' && STATE.a11ySettings.highContrast) || 
                             (option.value === 'normal' && !STATE.a11ySettings.highContrast);
        });
        
        // Update checkboxes
        if (DOM.reduceMotion) DOM.reduceMotion.checked = STATE.a11ySettings.reduceMotion;
        if (DOM.enhanceFocus) DOM.enhanceFocus.checked = STATE.a11ySettings.enhanceFocus;
        if (DOM.verboseAnnouncements) DOM.verboseAnnouncements.checked = STATE.a11ySettings.verboseAnnouncements;
    }

    function toggleA11yPanel() {
        // Toggle the hidden attribute
        const isPanelHidden = DOM.a11yPanel.hasAttribute('hidden');
        
        if (isPanelHidden) {
            DOM.a11yPanel.removeAttribute('hidden');
            document.body.setAttribute('data-a11y-panel-open', 'true');
            
            // Set focus to the first control in the panel
            setTimeout(() => {
                const firstControl = DOM.a11yPanel.querySelector('button, input, select');
                if (firstControl) firstControl.focus();
            }, 100);
            
            // Announce to screen readers
            announceScreenReader('Accessibility panel opened.');
        } else {
            DOM.a11yPanel.setAttribute('hidden', 'true');
            document.body.removeAttribute('data-a11y-panel-open');
            
            // Return focus to the toggle button
            if (DOM.a11yToggle) DOM.a11yToggle.focus();
            
            // Announce to screen readers
            announceScreenReader('Accessibility panel closed.');
        }
    }

    function saveA11ySettings() {
        // Save settings to storage
        saveToStorage(CONFIG.storage.keys.a11ySettings, STATE.a11ySettings);
        
        // Apply settings
        applyA11ySettings();
        
        // Close panel
        DOM.a11yPanel.setAttribute('hidden', 'true');
        document.body.removeAttribute('data-a11y-panel-open');
        
        // Show toast
        showToast({
            title: 'Settings Saved',
            message: 'Your accessibility preferences have been saved.',
            type: 'success'
        });
        
        // Announce to screen readers
        announceScreenReader('Accessibility settings saved and applied.');
    }

    function announceScreenReader(message) {
        if (!DOM.announcer || !STATE.a11ySettings.verboseAnnouncements) return;
        
        DOM.announcer.textContent = message;
        
        // Clear after a delay to allow re-announcement of the same message
        setTimeout(() => {
            DOM.announcer.textContent = '';
        }, 1000);
    }

    /**
     * Language Handling
     * ===============
     */
    function toggleLanguageMenu() {
        const isMenuHidden = DOM.languageMenu.classList.contains('hidden');
        
        if (isMenuHidden) {
            DOM.languageMenu.classList.remove('hidden');
            DOM.languageButton.setAttribute('aria-expanded', 'true');
            
            // Set focus to the currently selected language option
            setTimeout(() => {
                const selectedOption = DOM.languageMenu.querySelector('[aria-selected="true"]');
                if (selectedOption) selectedOption.focus();
            }, 100);
        } else {
            DOM.languageMenu.classList.add('hidden');
            DOM.languageButton.setAttribute('aria-expanded', 'false');
        }
    }

    function selectLanguage(langCode) {
        if (langCode === STATE.language) return;
        
        // Update state
        STATE.language = langCode;
        
        // Update UI
        DOM.languageOptions.forEach(option => {
            const isSelected = option.dataset.lang === langCode;
            option.setAttribute('aria-selected', isSelected.toString());
            option.tabIndex = isSelected ? 0 : -1;
        });
        
        // Update display text
        const langDisplay = DOM.languageButton.querySelector('.current-language');
        if (langDisplay) {
            langDisplay.textContent = langCode.toUpperCase();
        }
        
        // Close the menu
        DOM.languageMenu.classList.add('hidden');
        DOM.languageButton.setAttribute('aria-expanded', 'false');
        
        // Save preference
        saveToStorage(CONFIG.storage.keys.language, langCode);
        
        // In a real app, this would load language-specific content
        // For this demo, show a toast notification
        showToast({
            title: 'Language Changed',
            message: `The interface language has been changed to ${getLanguageName(langCode)}.`,
            type: 'info'
        });
        
        // Announce to screen readers
        announceScreenReader(`Language changed to ${getLanguageName(langCode)}.`);
    }

    function getLanguageName(code) {
        const languages = {
            'en': 'English',
            'es': 'Spanish (Español)',
            'fr': 'French (Français)',
            'de': 'German (Deutsch)',
            'ja': 'Japanese (日本語)',
            'ar': 'Arabic (العربية)'
        };
        
        return languages[code] || code;
    }

    /**
     * Navigation Setup
     * ==============
     */
    function setupNavigation() {
        // Handle initial section based on URL hash if present
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            navigateToSection(hash);
        }
    }

    function navigateToSection(sectionId) {
        // Find the section element
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        // Update state
        STATE.currentSection = sectionId;
        
        // Update active section
        DOM.contentSections.forEach(s => {
            s.classList.toggle('active', s.id === sectionId);
            if (s.id === sectionId) {
                // Ensure the section header is in view and focusable
                const heading = s.querySelector('h1');
                if (heading) {
                    heading.setAttribute('tabindex', '-1');
                    heading.focus();
                }
            }
        });
        
        // Update navigation items
        DOM.navItems.forEach(item => {
            const parentLi = item.parentElement;
            const itemSection = item.dataset.section;
            
            // Update aria attributes
            if (itemSection === sectionId) {
                item.setAttribute('aria-current', 'page');
                parentLi.classList.add('active');
            } else {
                item.removeAttribute('aria-current');
                parentLi.classList.remove('active');
            }
        });
        
        // Close mobile menu if open
        DOM.primaryNavigation.classList.remove('show');
        
        // Update URL hash without scrolling
        const scrollPosition = window.scrollY;
        window.location.hash = sectionId;
        window.scrollTo(0, scrollPosition);
        
        // Announce page change to screen readers
        const sectionTitle = section.querySelector('h1')?.textContent || sectionId;
        announceScreenReader(`Navigated to ${sectionTitle} section.`);
    }

    /**
     * Dashboard Components
     * ==================
     */
    function renderCategories() {
        // Skip if containers don't exist
        if (!DOM.categoryContainer && !DOM.testCategoryContainer) return;
        
        // Render training set categories
        if (DOM.categoryContainer) {
            DOM.categoryContainer.innerHTML = '';
            renderCategorySet(DOM.categoryContainer, 'train');
        }
        
        // Render test set categories
        if (DOM.testCategoryContainer) {
            DOM.testCategoryContainer.innerHTML = '';
            renderCategorySet(DOM.testCategoryContainer, 'test');
        }
    }

    function renderCategorySet(container, setType) {
        CONFIG.categories.forEach(category => {
            const count = setType === 'train' ? category.trainCount : category.testCount;
            const viewedClass = STATE.viewedCategories.includes(category.name) ? 'viewed' : '';
            
            const categoryCard = document.createElement('div');
            categoryCard.className = `category-card ${viewedClass}`;
            categoryCard.innerHTML = `
                <div class="category-icon" style="background: linear-gradient(135deg, ${category.color}, var(--accent))">
                    <i class="${category.icon}" aria-hidden="true"></i>
                </div>
                <h3>${category.name.charAt(0).toUpperCase() + category.name.slice(1)}</h3>
                <div class="image-count">${numberWithCommas(count)} images</div>
                <button class="btn btn-primary view-category-btn" 
                        data-category="${category.name}" 
                        aria-label="View ${category.name} images">
                    <i class="fas fa-eye" aria-hidden="true"></i> View Images
                </button>
            `;
            
            container.appendChild(categoryCard);
            
            // Add event listener to the button
            const button = categoryCard.querySelector('.view-category-btn');
            button.addEventListener('click', () => viewCategoryImages(category.name, setType));
        });
    }

    function animateStatCounters() {
        if (!DOM.statCounters) return;
        
        DOM.statCounters.forEach(counter => {
            const targetValue = parseInt(counter.dataset.count, 10);
            if (isNaN(targetValue)) return;
            
            // Start from zero and animate to target value
            let startValue = 0;
            const duration = 2000; // ms
            const steps = 60;
            const increment = targetValue / steps;
            const stepDuration = duration / steps;
            let currentStep = 0;
            
            const animation = setInterval(() => {
                currentStep++;
                const currentValue = Math.min(Math.round(increment * currentStep), targetValue);
                counter.textContent = numberWithCommas(currentValue);
                
                if (currentStep >= steps) {
                    clearInterval(animation);
                    counter.textContent = numberWithCommas(targetValue);
                }
            }, stepDuration);
        });
    }

    /**
     * Tab Management
     * =============
     */
    function initializeTabs() {
        if (!DOM.dashboardTabs) return;
        
        DOM.dashboardTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('id');
                const panelId = tab.getAttribute('aria-controls');
                const tabGroup = document.querySelectorAll(`[role="tab"][aria-controls^="${panelId.split('-')[0]}"]`);
                
                // Update tab states
                tabGroup.forEach(t => {
                    const isCurrentTab = t.id === tabId;
                    t.setAttribute('aria-selected', isCurrentTab.toString());
                    
                    // Update the panel visibility
                    const panel = document.getElementById(t.getAttribute('aria-controls'));
                    if (panel) {
                        panel.classList.toggle('hidden', !isCurrentTab);
                    }
                });
                
                // Update state for dataset tabs
                if (tabId === 'tab-train' || tabId === 'tab-test') {
                    STATE.currentSet = tab.dataset.tab;
                }
                
                // Announce tab change to screen readers
                announceScreenReader(`${tab.textContent} tab selected.`);
            });
        });
    }

    /**
     * Dataset Browser
     * =============
     */
    function initializeCategoryList() {
        if (!DOM.categoryList) return;
        
        // Clear existing list
        DOM.categoryList.innerHTML = '';
        
        // Add categories
        CONFIG.categories.forEach(category => {
            const listItem = document.createElement('li');
            listItem.dataset.category = category.name;
            listItem.innerHTML = `
                <i class="${category.icon}" style="color: ${category.color}" aria-hidden="true"></i>
                <span>${category.name.charAt(0).toUpperCase() + category.name.slice(1)}</span>
            `;
            
            // Add click event
            listItem.addEventListener('click', () => {
                // Update active category
                DOM.categoryList.querySelectorAll('li').forEach(item => {
                    item.classList.remove('active');
                });
                listItem.classList.add('active');
                
                // Load category images
                STATE.currentCategory = category.name;
                STATE.currentPage = 1;
                loadCategoryImages(category.name);
                
                // Save selected category
                saveToStorage(CONFIG.storage.keys.selectedCategory, category.name);
                
                // Announce to screen readers
                announceScreenReader(`${category.name} category selected. Loading images.`);
            });
            
            DOM.categoryList.appendChild(listItem);
            
            // If this is the currently selected category, mark it active
            if (category.name === STATE.currentCategory) {
                listItem.classList.add('active');
                
                // Load images for the pre-selected category
                setTimeout(() => {
                    loadCategoryImages(category.name);
                }, 500);
            }
        });
    }

    function viewCategoryImages(categoryName, setType = 'train') {
        // Add to viewed categories
        if (!STATE.viewedCategories.includes(categoryName)) {
            STATE.viewedCategories.push(categoryName);
            saveToStorage(CONFIG.storage.keys.viewedCategories, STATE.viewedCategories);
        }
        
        // Update current set and category
        STATE.currentSet = setType;
        STATE.currentCategory = categoryName;
        
        // Navigate to dataset section
        navigateToSection('dataset');
        
        // Find and activate the category in the list
        if (DOM.categoryList) {
            const categoryItem = DOM.categoryList.querySelector(`li[data-category="${categoryName}"]`);
            if (categoryItem) {
                // Simulate a click on the category
                categoryItem.click();
            }
        }
    }

    function loadCategoryImages(categoryName) {
        if (!DOM.imagesGrid) return;
        
        // Show loading state
        DOM.imagesGrid.innerHTML = `
            <div class="empty-state">
                <div class="loading-spinner"></div>
                <p>Loading ${categoryName} images...</p>
            </div>
        `;
        
        // Get the category details
        const category = CONFIG.categories.find(c => c.name === categoryName);
        if (!category) return;
        
        // Calculate pagination
        const totalImages = STATE.currentSet === 'train' ? category.trainCount : category.testCount;
        const totalPages = Math.ceil(totalImages / STATE.itemsPerPage);
        const startIndex = (STATE.currentPage - 1) * STATE.itemsPerPage;
        const endIndex = Math.min(startIndex + STATE.itemsPerPage, totalImages);
        
        // Update pagination controls
        updatePaginationControls(STATE.currentPage, totalPages);
        
        // In a real application, we would fetch actual images from the server
        // For this demo, simulate image loading with a delay
        setTimeout(() => {
            // Generate grid of placeholder images
            DOM.imagesGrid.innerHTML = '';
            
            for (let i = startIndex; i < endIndex; i++) {
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                imageItem.dataset.id = `${categoryName}-${STATE.currentSet}-${i + 1}`;
                
                // Use background color based on category
                imageItem.innerHTML = `
                    <div style="background-color: ${category.color}20; width: 100%; height: 100%; 
                                display: flex; align-items: center; justify-content: center;">
                        <span style="color: ${category.color}; font-size: 12px;">${i + 1}</span>
                    </div>
                    <div class="image-overlay">
                        <div class="image-caption">${categoryName} ${i + 1}</div>
                    </div>
                `;
                
                // Add click event to show large image in modal
                imageItem.addEventListener('click', () => {
                    showImageViewer(categoryName, i + 1);
                });
                
                // Add keyboard support
                imageItem.setAttribute('tabindex', '0');
                imageItem.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        showImageViewer(categoryName, i + 1);
                    }
                });
                
                DOM.imagesGrid.appendChild(imageItem);
            }
            
            // Reset the selection counter
            updateSelectionCounter(0);
            
            // Announce loaded images to screen readers
            announceScreenReader(`Loaded ${endIndex - startIndex} ${categoryName} images, page ${STATE.currentPage} of ${totalPages}.`);
        }, 800);
    }

    function updatePaginationControls(currentPage, totalPages) {
        if (!DOM.pageIndicator || !DOM.prevPage || !DOM.nextPage) return;
        
        // Update page indicator
        DOM.pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
        
        // Update buttons state
        DOM.prevPage.disabled = currentPage <= 1;
        DOM.nextPage.disabled = currentPage >= totalPages;
        
        // Set aria attributes
        DOM.prevPage.setAttribute('aria-disabled', (currentPage <= 1).toString());
        DOM.nextPage.setAttribute('aria-disabled', (currentPage >= totalPages).toString());
    }

    function updateSelectionCounter(count) {
        if (!DOM.selectionCount || !DOM.downloadSelected) return;
        
        DOM.selectionCount.textContent = `${count} images selected`;
        DOM.downloadSelected.disabled = count === 0;
        DOM.downloadSelected.setAttribute('aria-disabled', (count === 0).toString());
    }

    function showImageViewer(category, imageId) {
        if (!DOM.imageViewerModal) return;
        
        // Update modal content
        DOM.imageCategory.textContent = category;
        DOM.imageSet.textContent = STATE.currentSet;
        
        // In a real app, set the actual image src
        // For the demo, use colored div with the category color
        const categoryObj = CONFIG.categories.find(c => c.name === category);
        const color = categoryObj ? categoryObj.color : '#3b82f6';
        
        DOM.showcaseImage.style.backgroundColor = `${color}20`;
        DOM.showcaseImage.style.width = '256px';
        DOM.showcaseImage.style.height = '256px';
        DOM.showcaseImage.style.display = 'flex';
        DOM.showcaseImage.style.alignItems = 'center';
        DOM.showcaseImage.style.justifyContent = 'center';
        DOM.showcaseImage.style.fontSize = '24px';
        DOM.showcaseImage.style.fontWeight = '500';
        DOM.showcaseImage.style.color = color;
        DOM.showcaseImage.textContent = `${category} ${imageId}`;
        
        // Show modal
        showModal(DOM.imageViewerModal);
        
        // Focus on the image
        DOM.showcaseImage.focus();
        
        // Add download handler
        if (DOM.downloadImageBtn) {
            DOM.downloadImageBtn.onclick = () => {
                // In a real app, this would download the actual image
                showToast({
                    title: 'Download Started',
                    message: `Downloading ${category} image ${imageId}...`,
                    type: 'info'
                });
            };
        }
    }

    /**
     * Training Functionality
     * ====================
     */
    function initializeForms() {
        // Skip if training form elements don't exist
        if (!DOM.modelType || !DOM.epochs || !DOM.epochsRange) return;
        
        // Sync epochs range and number input
        DOM.epochsRange.addEventListener('input', () => {
            DOM.epochs.value = DOM.epochsRange.value;
        });
        
        DOM.epochs.addEventListener('input', () => {
            DOM.epochsRange.value = DOM.epochs.value;
        });
        
        // Toggle advanced options
        if (DOM.advancedOptionsBtn && DOM.advancedOptionsSection) {
            DOM.advancedOptionsBtn.addEventListener('click', () => {
                const isExpanded = DOM.advancedOptionsSection.classList.contains('hidden');
                DOM.advancedOptionsSection.classList.toggle('hidden', !isExpanded);
                DOM.advancedOptionsBtn.setAttribute('aria-expanded', isExpanded.toString());
                
                // Announce to screen readers
                announceScreenReader(isExpanded ? 'Advanced options expanded.' : 'Advanced options collapsed.');
            });
        }
        
        // Update model info when model type changes
        if (DOM.modelType && DOM.modelInfo) {
            DOM.modelType.addEventListener('change', updateModelInfo);
            // Initial update
            updateModelInfo();
        }
        
        // Reset form button
        if (DOM.resetFormBtn) {
            DOM.resetFormBtn.addEventListener('click', resetTrainingForm);
        }
        
        // Start training button
        if (DOM.startTrainingBtn) {
            DOM.startTrainingBtn.addEventListener('click', startTraining);
        }
        
        // Training control buttons
        if (DOM.cancelTrainingBtn) {
            DOM.cancelTrainingBtn.addEventListener('click', cancelTraining);
        }
        
        if (DOM.pauseTrainingBtn) {
            DOM.pauseTrainingBtn.addEventListener('click', togglePauseTraining);
        }
    }

    function updateModelInfo() {
        if (!DOM.modelType || !DOM.modelInfo) return;
        
        const modelType = DOM.modelType.value;
        const modelData = CONFIG.modelArchitectures[modelType];
        
        if (!modelData) {
            DOM.modelInfo.innerHTML = '<p>Model information not available.</p>';
            return;
        }
        
        // Generate model info HTML
        const html = `
            <div class="model-details-card">
                <p class="model-description">${modelData.description}</p>
                <div class="model-stats">
                    <div class="model-stat-item">
                        <span class="stat-label">Parameters:</span>
                        <span class="stat-value">${numberWithCommas(modelData.parameters)}</span>
                    </div>
                    <div class="model-stat-item">
                        <span class="stat-label">Size:</span>
                        <span class="stat-value">${modelData.size}</span>
                    </div>
                    <div class="model-stat-item">
                        <span class="stat-label">Training Time:</span>
                        <span class="stat-value">${modelData.trainingTime}</span>
                    </div>
                    <div class="model-stat-item">
                        <span class="stat-label">Base Accuracy:</span>
                        <span class="stat-value">${(modelData.baseAccuracy * 100).toFixed(1)}%</span>
                    </div>
                </div>
            </div>
        `;
        
        // Apply with animation
        DOM.modelInfo.style.opacity = '0';
        setTimeout(() => {
            DOM.modelInfo.innerHTML = html;
            DOM.modelInfo.style.opacity = '1';
        }, 200);
    }

    function resetTrainingForm() {
        // Skip if form doesn't exist
        if (!DOM.modelType) return;
        
        // Reset form fields
        DOM.modelType.value = 'cnn';
        DOM.batchSize.value = '32';
        DOM.epochs.value = '10';
        DOM.epochsRange.value = '10';
        DOM.learningRate.value = '0.001';
        DOM.augFlip.checked = true;
        DOM.augRotation.checked = true;
        DOM.augShift.checked = false;
        DOM.augZoom.checked = false;
        
        // Reset advanced options if they exist
        if (document.getElementById('optimizer')) {
            document.getElementById('optimizer').value = 'adam';
        }
        
        if (document.getElementById('loss-function')) {
            document.getElementById('loss-function').value = 'categorical_crossentropy';
        }
        
        // Hide advanced options
        if (DOM.advancedOptionsSection) {
            DOM.advancedOptionsSection.classList.add('hidden');
            DOM.advancedOptionsBtn.setAttribute('aria-expanded', 'false');
        }
        
        // Update model info
        updateModelInfo();
        
        // Clear training log if visible
        if (DOM.trainingLog) {
            DOM.trainingLog.innerHTML = '<p>Ready to start training. Configure parameters and click "Start Training"...</p>';
        }
        
        // Show toast
        showToast({
            title: 'Form Reset',
            message: 'Training form has been reset to default values.',
            type: 'info'
        });
        
        // Announce to screen readers
        announceScreenReader('Training form reset to default values.');
    }

    function startTraining() {
        if (STATE.training.inProgress) {
            showToast({
                title: 'Training in Progress',
                message: 'Please wait for the current training session to complete or cancel it.',
                type: 'warning'
            });
            return;
        }
        
        // Get form values
        const modelType = DOM.modelType.value;
        const batchSize = parseInt(DOM.batchSize.value, 10);
        const epochs = parseInt(DOM.epochs.value, 10);
        const learningRate = parseFloat(DOM.learningRate.value);
        const augmentations = {
            flip: DOM.augFlip.checked,
            rotation: DOM.augRotation.checked,
            shift: DOM.augShift.checked,
            zoom: DOM.augZoom.checked
        };
        
        // Get advanced options if available
        const optimizer = document.getElementById('optimizer')?.value || 'adam';
        const lossFunction = document.getElementById('loss-function')?.value || 'categorical_crossentropy';
        
        // Update state
        STATE.training = {
            inProgress: true,
            paused: false,
            progress: 0,
            currentEpoch: 0,
            totalEpochs: epochs,
            startTime: new Date(),
            elapsedTime: 0,
            modelType: modelType,
            batchSize: batchSize,
            learningRate: learningRate,
            augmentations: augmentations,
            optimizer: optimizer,
            lossFunction: lossFunction,
            logs: [],
            metrics: {
                trainAccuracy: [],
                valAccuracy: [],
                trainLoss: [],
                valLoss: []
            }
        };
        
        // Show training progress container
        if (DOM.trainingProgressContainer) {
            DOM.trainingProgressContainer.classList.remove('hidden');
        }
        
        // Hide training form
        if (DOM.modelType.closest('.training-panel')) {
            DOM.modelType.closest('.training-panel').classList.add('hidden');
        }
        
        // Clear training log
        if (DOM.trainingLog) {
            DOM.trainingLog.innerHTML = '';
        }
        
        // Initialize charts
        initializeTrainingCharts();
        
        // Start training process
        simulateTrainingProcess();
    }

    function simulateTrainingProcess() {
        // Log the initial setup
        logTrainingMessage(`Initializing ${STATE.training.modelType.toUpperCase()} model training...`);
        logTrainingMessage(`Configuration:
  - Batch size: ${STATE.training.batchSize}
  - Learning rate: ${STATE.training.learningRate}
  - Epochs: ${STATE.training.totalEpochs}
  - Optimizer: ${STATE.training.optimizer}
  - Loss function: ${STATE.training.lossFunction}
  - Augmentations: ${Object.entries(STATE.training.augmentations)
                          .filter(([_, enabled]) => enabled)
                          .map(([name]) => name)
                          .join(', ')}`, 'command');
        
        // Simulate loading dataset
        logTrainingMessage('Loading CIFAR-10 dataset...');
        
        let trainingTimer = setInterval(() => {
            if (!STATE.training.paused) {
                STATE.training.elapsedTime += 1;
                updateTrainingTimers();
            }
        }, 1000);
        
        // Simulate dataset loading
        setTimeout(() => {
            if (!STATE.training.inProgress) {
                clearInterval(trainingTimer);
                return;
            }
            
            logTrainingMessage('Dataset loaded: 50,000 training images, 10,000 validation images.');
            logTrainingMessage(`Creating ${STATE.training.modelType.toUpperCase()} model architecture...`);
            
            // Show model architecture
            const architecture = CONFIG.modelArchitectures[STATE.training.modelType];
            if (architecture) {
                setTimeout(() => {
                    if (!STATE.training.inProgress) {
                        clearInterval(trainingTimer);
                        return;
                    }
                    
                    logTrainingMessage('Model architecture:');
                    architecture.layers.forEach(layer => {
                        let layerDescription = `- ${layer.type}`;
                        if (layer.filters) layerDescription += `: ${layer.filters} filters`;
                        if (layer.kernelSize) layerDescription += `, ${layer.kernelSize} kernel`;
                        if (layer.stride) layerDescription += `, stride ${layer.stride}`;
                        if (layer.activation) layerDescription += `, ${layer.activation} activation`;
                        if (layer.units) layerDescription += `: ${layer.units} units`;
                        if (layer.blocks) layerDescription += `: ${layer.blocks} blocks`;
                        if (layer.expansion) layerDescription += `: ${layer.expansion}x expansion`;
                        if (layer.repeats) layerDescription += `: ${layer.repeats} repeats`;
                        
                        logTrainingMessage(layerDescription);
                    });
                    
                    logTrainingMessage(`Total parameters: ${numberWithCommas(architecture.parameters)}`);
                    logTrainingMessage(`Compiling model with ${STATE.training.optimizer} optimizer and ${STATE.training.lossFunction} loss`);
                    
                    // Start training epochs
                    logTrainingMessage('Training started...', 'success');
                    setTimeout(() => {
                        if (!STATE.training.inProgress) {
                            clearInterval(trainingTimer);
                            return;
                        }
                        
                        simulateTrainingEpochs(trainingTimer);
                    }, 500);
                }, 1500);
            } else {
                // Skip architecture display if not found
                logTrainingMessage(`Compiling model with ${STATE.training.optimizer} optimizer and ${STATE.training.lossFunction} loss`);
                logTrainingMessage('Training started...', 'success');
                
                // Start training epochs
                setTimeout(() => {
                    if (!STATE.training.inProgress) {
                        clearInterval(trainingTimer);
                        return;
                    }
                    
                    simulateTrainingEpochs(trainingTimer);
                }, 500);
            }
        }, 1500);
    }

    function simulateTrainingEpochs(trainingTimer) {
        const modelData = CONFIG.modelArchitectures[STATE.training.modelType];
        if (!modelData) {
            finishTraining(0.75, trainingTimer);
            return;
        }
        
        // Get base accuracy and adjust based on configuration
        let baseAccuracy = modelData.baseAccuracy;
        
        // Apply adjustments based on learning rate
        if (STATE.training.learningRate === 0.01) {
            baseAccuracy *= 0.95; // Potentially overshooting optimal
        } else if (STATE.training.learningRate === 0.0001) {
            baseAccuracy *= 0.98; // Potentially too slow to converge in given epochs
        }
        
        // Apply adjustments for augmentations
        if (STATE.training.augmentations.flip) baseAccuracy *= 1.02;
        if (STATE.training.augmentations.rotation) baseAccuracy *= 1.01;
        if (STATE.training.augmentations.shift) baseAccuracy *= 1.01;
        if (STATE.training.augmentations.zoom) baseAccuracy *= 1.01;
        
        // Cap at reasonable maximum
        baseAccuracy = Math.min(baseAccuracy, 0.97);
        
        // Function to run each epoch
        const runEpoch = () => {
            // Skip if training was cancelled
            if (!STATE.training.inProgress) {
                clearInterval(trainingTimer);
                return;
            }
            
            // Skip if paused
            if (STATE.training.paused) {
                setTimeout(runEpoch, 500);
                return;
            }
            
            // Increment epoch counter
            STATE.training.currentEpoch++;
            const currentEpoch = STATE.training.currentEpoch;
            
            // Calculate progress percentage
            STATE.training.progress = Math.round((currentEpoch / STATE.training.totalEpochs) * 100);
            
            // Generate training metrics with learning curve and noise
            const progressFactor = currentEpoch / STATE.training.totalEpochs;
            const learningCurve = 1 - Math.exp(-progressFactor * 3); // Exponential curve approaching 1
            
            // Add some randomness
            const trainAcc = Math.min(
                (baseAccuracy - 0.15) + (0.15 * learningCurve) + (Math.random() * 0.02 - 0.01),
                baseAccuracy
            );
            
            const valAcc = Math.min(
                (baseAccuracy - 0.2) + (0.2 * learningCurve) + (Math.random() * 0.03 - 0.015),
                baseAccuracy * 0.99
            );
            
            const trainLoss = Math.max(
                1.5 - (1.3 * learningCurve) + (Math.random() * 0.05 - 0.025),
                0.1
            );
            
            const valLoss = Math.max(
                1.7 - (1.4 * learningCurve) + (Math.random() * 0.08 - 0.04),
                0.2
            );
            
            // Store metrics
            STATE.training.metrics.trainAccuracy.push(trainAcc);
            STATE.training.metrics.valAccuracy.push(valAcc);
            STATE.training.metrics.trainLoss.push(trainLoss);
            STATE.training.metrics.valLoss.push(valLoss);
            
            // Update UI
            updateTrainingUI();
            updateTrainingCharts();
            
            // Log epoch results
            logTrainingMessage(`Epoch ${currentEpoch}/${STATE.training.totalEpochs} - loss: ${trainLoss.toFixed(4)} - accuracy: ${(trainAcc * 100).toFixed(2)}% - val_loss: ${valLoss.toFixed(4)} - val_accuracy: ${(valAcc * 100).toFixed(2)}%`);
            
            // Either continue or finish
            if (currentEpoch < STATE.training.totalEpochs) {
                // Calculate delay for next epoch based on model complexity
                // More complex models take longer per epoch
                const baseDelay = 800;
                const complexityFactor = modelData.parameters / 1000000; // In millions
                const epochDelay = baseDelay + (complexityFactor * 200);
                
                setTimeout(runEpoch, epochDelay);
            } else {
                finishTraining(valAcc, trainingTimer);
            }
        };
        
        // Start first epoch
        setTimeout(runEpoch, 500);
    }

    function updateTrainingUI() {
        // Update progress bar
        if (DOM.trainingProgressBar) {
            DOM.trainingProgressBar.style.width = `${STATE.training.progress}%`;
            DOM.trainingProgressBar.setAttribute('aria-valuenow', STATE.training.progress.toString());
        }
        
        // Update percentage text
        if (DOM.progressPercentage) {
            DOM.progressPercentage.textContent = `${STATE.training.progress}%`;
        }
        
        // Update epoch counter
        if (DOM.currentEpoch) {
            DOM.currentEpoch.textContent = `${STATE.training.currentEpoch}/${STATE.training.totalEpochs}`;
        }
        
        // Update accuracy
        if (DOM.currentAccuracy) {
            const latestValAcc = STATE.training.metrics.valAccuracy[STATE.training.metrics.valAccuracy.length - 1];
            if (latestValAcc !== undefined) {
                DOM.currentAccuracy.textContent = `${(latestValAcc * 100).toFixed(2)}%`;
            }
        }
    }

    function updateTrainingTimers() {
        // Update elapsed time
        if (DOM.trainingTime) {
            DOM.trainingTime.textContent = formatTime(STATE.training.elapsedTime);
        }
        
        // Update ETA
        if (DOM.trainingEta && STATE.training.currentEpoch > 0) {
            const timePerEpoch = STATE.training.elapsedTime / STATE.training.currentEpoch;
            const remainingEpochs = STATE.training.totalEpochs - STATE.training.currentEpoch;
            const estimatedRemainingTime = timePerEpoch * remainingEpochs;
            
            DOM.trainingEta.textContent = formatTime(estimatedRemainingTime);
        }
    }

    function logTrainingMessage(message, type = '') {
        if (!DOM.trainingLog) return;
        
        // Add to training logs in state
        STATE.training.logs.push({
            message,
            type,
            timestamp: new Date()
        });
        
        // Create paragraph element
        const p = document.createElement('p');
        p.textContent = message;
        
        if (type) {
            p.classList.add(type);
        }
        
        // Add to DOM
        DOM.trainingLog.appendChild(p);
        
        // Auto-scroll to the bottom
        DOM.trainingLog.scrollTop = DOM.trainingLog.scrollHeight;
    }

    function finishTraining(finalAccuracy, trainingTimer) {
        // Clear the timer
        clearInterval(trainingTimer);
        
        // Log completion
        const elapsedTime = STATE.training.elapsedTime;
        logTrainingMessage(`Training completed in ${formatTime(elapsedTime)}.`, 'success');
        logTrainingMessage(`Final validation accuracy: ${(finalAccuracy * 100).toFixed(2)}%`, 'success');
        
        // Generate a model name
        const modelType = STATE.training.modelType;
        const currentDate = new Date();
        const modelName = `CIFAR10_${modelType.toUpperCase()}_${formatDate(currentDate)}`;
        
        // Create model object
        const modelSize = CONFIG.modelArchitectures[modelType]?.size || '5.0 MB';
        const newModel = {
            id: Date.now(),
            name: modelName,
            type: modelType,
            accuracy: (finalAccuracy * 100).toFixed(2),
            date: formatDate(currentDate),
            trainingTime: formatTime(elapsedTime),
            size: modelSize,
            description: CONFIG.modelArchitectures[modelType]?.description || 
                        'A machine learning model trained on the CIFAR-10 dataset.',
            metrics: STATE.training.metrics
        };
        
        // Add to saved models
        STATE.models.push(newModel);
        saveToStorage(CONFIG.storage.keys.models, STATE.models);
        
        // Reset training state
        STATE.training.inProgress = false;
        
        // Update pause button text
        if (DOM.pauseTrainingBtn) {
            DOM.pauseTrainingBtn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i> Pause';
        }
        
        // Log model saved message
        logTrainingMessage(`Model saved as "${modelName}"`);
        
        // Render models
        renderSavedModels();
        
        // Show success notification
        showToast({
            title: 'Training Complete',
            message: `Model "${modelName}" trained successfully with ${(finalAccuracy * 100).toFixed(2)}% accuracy.`,
            type: 'success'
        });
        
        // Announce to screen readers
        announceScreenReader(`Training complete. Model saved with ${(finalAccuracy * 100).toFixed(2)}% accuracy.`);
        
        // Reset UI after a delay
        setTimeout(() => {
            // Show the training form again
            if (DOM.modelType.closest('.training-panel')) {
                DOM.modelType.closest('.training-panel').classList.remove('hidden');
            }
            
            // Hide the progress container
            if (DOM.trainingProgressContainer) {
                DOM.trainingProgressContainer.classList.add('hidden');
            }
        }, 3000);
    }

    function cancelTraining() {
        if (!STATE.training.inProgress) return;
        
        // Show confirmation dialog
        if (confirm('Are you sure you want to cancel the current training session? All progress will be lost.')) {
            // Stop training
            STATE.training.inProgress = false;
            
            // Reset UI
            if (DOM.modelType.closest('.training-panel')) {
                DOM.modelType.closest('.training-panel').classList.remove('hidden');
            }
            
            if (DOM.trainingProgressContainer) {
                DOM.trainingProgressContainer.classList.add('hidden');
            }
            
            // Show notification
            showToast({
                title: 'Training Cancelled',
                message: 'The training session has been cancelled.',
                type: 'warning'
            });
            
            // Announce to screen readers
            announceScreenReader('Training cancelled.');
        }
    }

    function togglePauseTraining() {
        if (!STATE.training.inProgress) return;
        
        STATE.training.paused = !STATE.training.paused;
        
        // Update button text
        if (DOM.pauseTrainingBtn) {
            DOM.pauseTrainingBtn.innerHTML = STATE.training.paused ?
                '<i class="fas fa-play" aria-hidden="true"></i> Resume' :
                '<i class="fas fa-pause" aria-hidden="true"></i> Pause';
        }
        
        // Log message
        logTrainingMessage(STATE.training.paused ? 'Training paused.' : 'Training resumed.', 
                           STATE.training.paused ? 'warning' : 'success');
        
        // Show toast
        showToast({
            title: STATE.training.paused ? 'Training Paused' : 'Training Resumed',
            message: STATE.training.paused ? 
                     'The training session has been paused.' :
                     'The training session has been resumed.',
            type: 'info'
        });
        
        // Announce to screen readers
        announceScreenReader(STATE.training.paused ? 'Training paused.' : 'Training resumed.');
    }

    /**
     * Model Management
     * ==============
     */
    function loadSavedModels() {
        // Load saved models from storage
        const savedModels = getFromStorage(CONFIG.storage.keys.models);
        if (savedModels && Array.isArray(savedModels)) {
            STATE.models = savedModels;
        } else {
            // Add sample models for demo
            STATE.models = [
                {
                    id: 1,
                    name: 'CIFAR10_CNN_2025-05-15',
                    type: 'cnn',
                    accuracy: '82.34',
                    date: '2025-05-15',
                    trainingTime: '8m 15s',
                    size: '4.9 MB',
                    description: 'A basic CNN with 3 convolutional layers. Good for beginners and quick experiments.',
                    metrics: {
                        trainAccuracy: generateSampleMetrics(0.5, 0.85, 10),
                        valAccuracy: generateSampleMetrics(0.45, 0.82, 10),
                        trainLoss: generateSampleMetrics(1.5, 0.3, 10, true),
                        valLoss: generateSampleMetrics(1.7, 0.4, 10, true)
                    }
                },
                {
                    id: 2,
                    name: 'CIFAR10_RESNET_2025-05-17',
                    type: 'resnet',
                    accuracy: '89.76',
                    date: '2025-05-17',
                    trainingTime: '17m 42s',
                    size: '44.6 MB',
                    description: 'A residual network architecture with skip connections for better gradient flow during training.',
                    metrics: {
                        trainAccuracy: generateSampleMetrics(0.55, 0.92, 10),
                        valAccuracy: generateSampleMetrics(0.52, 0.9, 10),
                        trainLoss: generateSampleMetrics(1.4, 0.2, 10, true),
                        valLoss: generateSampleMetrics(1.5, 0.3, 10, true)
                    }
                }
            ];
        }
        
        // Render models
        renderSavedModels();
    }

    function renderSavedModels() {
        if (!DOM.modelsContainer || !DOM.emptyModels) return;
        
        // Show/hide empty state
        DOM.emptyModels.classList.toggle('hidden', STATE.models.length > 0);
        
        // Clear existing models
        const existingModels = DOM.modelsContainer.querySelectorAll('.model-card');
        existingModels.forEach(card => {
            if (card !== DOM.emptyModels) {
                card.remove();
            }
        });
        
        // Render each model
        STATE.models.forEach((model, index) => {
            const modelCard = document.createElement('div');
            modelCard.className = 'model-card';
            modelCard.setAttribute('role', 'listitem');
            
            // Try to find and use actual model color
            const modelType = model.type;
            const modelColor = getModelTypeColor(modelType);
            
            modelCard.innerHTML = `
                <div class="model-content">
                    <div class="model-title">
                        <i class="fas fa-cube" style="color: ${modelColor};" aria-hidden="true"></i>
                        <h4>${model.name}</h4>
                    </div>
                    <div class="model-meta">
                        <div class="model-meta-item">
                            <i class="fas fa-calendar-alt" aria-hidden="true"></i>
                            <span>${model.date}</span>
                        </div>
                        <div class="model-meta-item">
                            <i class="fas fa-chart-line" aria-hidden="true"></i>
                            <span>Accuracy: ${model.accuracy}%</span>
                        </div>
                        <div class="model-meta-item">
                            <i class="fas fa-clock" aria-hidden="true"></i>
                            <span>${model.trainingTime}</span>
                        </div>
                        <div class="model-meta-item">
                            <i class="fas fa-file" aria-hidden="true"></i>
                            <span>${model.size}</span>
                        </div>
                    </div>
                    <div class="model-description">
                        ${model.description}
                    </div>
                </div>
                <div class="model-actions">
                    <button class="btn btn-outline-light" aria-label="View details for ${model.name}">
                        <i class="fas fa-info-circle" aria-hidden="true"></i> Details
                    </button>
                    <button class="btn btn-primary" aria-label="Download ${model.name}">
                        <i class="fas fa-download" aria-hidden="true"></i> Download
                    </button>
                </div>
            `;
            
            // Add event listeners
            const detailsBtn = modelCard.querySelector('.btn-outline-light');
            const downloadBtn = modelCard.querySelector('.btn-primary');
            
            if (detailsBtn) {
                detailsBtn.addEventListener('click', () => showModelDetails(model));
            }
            
            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => downloadModel(model));
            }
            
            // Add to container
            DOM.modelsContainer.appendChild(modelCard);
        });
    }

    function showModelDetails(model) {
        if (!DOM.modelDetailsModal || !DOM.modelDetailsContent || !DOM.modelDetailsTitle) return;
        
        // Set modal title
        DOM.modelDetailsTitle.textContent = `Model Details: ${model.name}`;
        
        // Generate content HTML
        let html = `
            <div class="model-details-fullview">
                <div class="model-info-section">
                    <h4>Model Information</h4>
                    <div class="model-detail-grid">
                        <div class="detail-row">
                            <div class="detail-label">Architecture:</div>
                            <div class="detail-value">${model.type.toUpperCase()}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Accuracy:</div>
                            <div class="detail-value">${model.accuracy}%</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Size:</div>
                            <div class="detail-value">${model.size}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Created:</div>
                            <div class="detail-value">${model.date}</div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-label">Training Time:</div>
                            <div class="detail-value">${model.trainingTime}</div>
                        </div>
                    </div>
                </div>
                
                <div class="model-description-section">
                    <h4>Description</h4>
                    <p>${model.description}</p>
                </div>
        `;
        
        // Add performance visualization if metrics are available
        if (model.metrics && model.metrics.trainAccuracy && model.metrics.trainAccuracy.length > 0) {
            html += `
                <div class="model-performance-section">
                    <h4>Training Performance</h4>
                    <div class="model-charts">
                        <div class="model-chart-container">
                            <canvas id="modal-accuracy-chart" height="200"></canvas>
                        </div>
                        <div class="model-chart-container">
                            <canvas id="modal-loss-chart" height="200"></canvas>
                        </div>
                    </div>
                </div>
            `;
        }
        
        html += `</div>`;
        
        // Set content
        DOM.modelDetailsContent.innerHTML = html;
        
        // Show modal
        showModal(DOM.modelDetailsModal);
        
        // Initialize charts if metrics are available
        if (model.metrics && model.metrics.trainAccuracy && model.metrics.trainAccuracy.length > 0 && 
            typeof Chart !== 'undefined') {
            
            // Create accuracy chart
            const accuracyCtx = document.getElementById('modal-accuracy-chart').getContext('2d');
            new Chart(accuracyCtx, {
                type: 'line',
                data: {
                    labels: Array.from({ length: model.metrics.trainAccuracy.length }, (_, i) => i + 1),
                    datasets: [
                        {
                            label: 'Training Accuracy',
                            data: model.metrics.trainAccuracy.map(val => val * 100),
                            borderColor: CONFIG.chartColors.primary,
                            backgroundColor: hexToRgba(CONFIG.chartColors.primary, 0.1),
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Validation Accuracy',
                            data: model.metrics.valAccuracy.map(val => val * 100),
                            borderColor: CONFIG.chartColors.success,
                            backgroundColor: hexToRgba(CONFIG.chartColors.success, 0.1),
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Accuracy Over Epochs',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        legend: {
                            position: 'top'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            min: 0,
                            max: 100,
                            title: {
                                display: true,
                                text: 'Accuracy (%)'
                            },
                            ticks: {
                                callback: function(value) {
                                    return value + '%';
                                }
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Epoch'
                            }
                        }
                    }
                }
            });
            
            // Create loss chart
            const lossCtx = document.getElementById('modal-loss-chart').getContext('2d');
            new Chart(lossCtx, {
                type: 'line',
                data: {
                    labels: Array.from({ length: model.metrics.trainLoss.length }, (_, i) => i + 1),
                    datasets: [
                        {
                            label: 'Training Loss',
                            data: model.metrics.trainLoss,
                            borderColor: CONFIG.chartColors.danger,
                            backgroundColor: hexToRgba(CONFIG.chartColors.danger, 0.1),
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Validation Loss',
                            data: model.metrics.valLoss,
                            borderColor: CONFIG.chartColors.warning,
                            backgroundColor: hexToRgba(CONFIG.chartColors.warning, 0.1),
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Loss Over Epochs',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        legend: {
                            position: 'top'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'Loss'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Epoch'
                            }
                        }
                    }
                }
            });
        }
        
        // Setup view analytics button
        if (DOM.viewAnalyticsBtn) {
            DOM.viewAnalyticsBtn.onclick = () => {
                // Close the modal
                hideModal(DOM.modelDetailsModal);
                
                // Navigate to analytics section and select this model
                navigateToSection('analytics');
                
                // TODO: Select the specific model in analytics view
                showToast({
                    title: 'Analytics View',
                    message: `Viewing analytics for ${model.name}`,
                    type: 'info'
                });
            };
        }
    }

    function downloadModel(model) {
        // In a real app, this would trigger a file download
        // For our demo, show a toast notification
        showToast({
            title: 'Download Started',
            message: `Downloading ${model.name} (${model.size})...`,
            type: 'info'
        });
        
        // Simulate a download delay
        setTimeout(() => {
            showToast({
                title: 'Download Complete',
                message: `${model.name} has been downloaded successfully.`,
                type: 'success'
            });
        }, 2000);
    }

    /**
     * Charts & Analytics
     * ================
     */
    function initializeCharts() {
        // Skip if Chart.js is not available
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not available. Visualization features will be limited.');
            return;
        }
        
        // Set up Chart.js defaults
        Chart.defaults.color = 'var(--text-secondary)';
        Chart.defaults.font.family = CONFIG.chartDefaults.fontFamily;
        Chart.defaults.font.size = CONFIG.chartDefaults.fontSize;
        Chart.defaults.animation.duration = CONFIG.chartDefaults.animation.duration;
        Chart.defaults.animation.easing = CONFIG.chartDefaults.animation.easing;
        Chart.defaults.plugins.tooltip.backgroundColor = 'var(--bg-card)';
        Chart.defaults.plugins.tooltip.titleColor = 'var(--text-primary)';
        Chart.defaults.plugins.tooltip.bodyColor = 'var(--text-secondary)';
        Chart.defaults.plugins.tooltip.borderColor = 'var(--border-primary)';
        Chart.defaults.plugins.tooltip.borderWidth = 1;
        Chart.defaults.plugins.legend.labels.boxWidth = 15;
        Chart.defaults.plugins.legend.labels.padding = 15;
        
        // Initialize analytics charts if we're in that section
        if (STATE.currentSection === 'analytics') {
            initializeAnalyticsCharts();
        }
    }

    function initializeTrainingCharts() {
        // Skip if Chart.js not available or charts don't exist
        if (typeof Chart === 'undefined' || !DOM.accuracyChart || !DOM.lossChart) return;
        
        // Destroy existing charts if they exist
        if (STATE.charts.accuracyChart) {
            STATE.charts.accuracyChart.destroy();
        }
        
        if (STATE.charts.lossChart) {
            STATE.charts.lossChart.destroy();
        }
        
        // Create accuracy chart
        STATE.charts.accuracyChart = new Chart(DOM.accuracyChart, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Training',
                        data: [],
                        borderColor: CONFIG.chartColors.primary,
                        backgroundColor: hexToRgba(CONFIG.chartColors.primary, 0.1),
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Validation',
                        data: [],
                        borderColor: CONFIG.chartColors.success,
                        backgroundColor: hexToRgba(CONFIG.chartColors.success, 0.1),
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        min: 0,
                        max: 1,
                        ticks: {
                            callback: function(value) {
                                return (value * 100).toFixed(0) + '%';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${(context.parsed.y * 100).toFixed(2)}%`;
                            }
                        }
                    }
                }
            }
        });
        
        // Create loss chart
        STATE.charts.lossChart = new Chart(DOM.lossChart, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Training',
                        data: [],
                        borderColor: CONFIG.chartColors.danger,
                        backgroundColor: hexToRgba(CONFIG.chartColors.danger, 0.1),
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Validation',
                        data: [],
                        borderColor: CONFIG.chartColors.warning,
                        backgroundColor: hexToRgba(CONFIG.chartColors.warning, 0.1),
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    function updateTrainingCharts() {
        // Skip if charts don't exist
        if (!STATE.charts.accuracyChart || !STATE.charts.lossChart) return;
        
        // Create labels array (1 to current epoch)
        const labels = Array.from({ length: STATE.training.currentEpoch }, (_, i) => i + 1);
        
        // Update accuracy chart
        STATE.charts.accuracyChart.data.labels = labels;
        STATE.charts.accuracyChart.data.datasets[0].data = STATE.training.metrics.trainAccuracy;
        STATE.charts.accuracyChart.data.datasets[1].data = STATE.training.metrics.valAccuracy;
        STATE.charts.accuracyChart.update();
        
        // Update loss chart
        STATE.charts.lossChart.data.labels = labels;
        STATE.charts.lossChart.data.datasets[0].data = STATE.training.metrics.trainLoss;
        STATE.charts.lossChart.data.datasets[1].data = STATE.training.metrics.valLoss;
        STATE.charts.lossChart.update();
    }

    function initializeAnalyticsCharts() {
        // Skip if Chart.js not available or the necessary elements don't exist
        if (typeof Chart === 'undefined' || 
            !DOM.comparisonChart || 
            !DOM.classAccuracyChart || 
            !DOM.confusionMatrix || 
            !DOM.trainingHistoryChart || 
            !DOM.resourceUsageChart) {
            return;
        }
        
        // Populate model selectors
        populateModelSelectors();
        
        // Initialize charts
        initializeComparisonChart();
        initializeClassAccuracyChart();
        initializeConfusionMatrix();
        initializeTrainingHistoryChart();
        initializeResourceUsageChart();
        
        // Add change event listeners to model selectors
        attachModelSelectorListeners();
    }

    function populateModelSelectors() {
        // Skip if no models or selectors
        if (STATE.models.length === 0 || 
            !DOM.modelSelectorAccuracy || 
            !DOM.modelSelectorConfusion || 
            !DOM.modelSelectorHistory || 
            !DOM.modelSelectorResource) {
            return;
        }
        
        // Clear existing options except "All Models"
        const selectors = [
            DOM.modelSelectorAccuracy,
            DOM.modelSelectorConfusion,
            DOM.modelSelectorHistory,
            DOM.modelSelectorResource
        ];
        
        selectors.forEach(selector => {
            // Keep only the first option (All Models)
            while (selector.options.length > 1) {
                selector.options.remove(1);
            }
            
            // Add model options
            STATE.models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.id;
                option.textContent = model.name;
                selector.appendChild(option);
            });
        });
    }

    function attachModelSelectorListeners() {
        // Model selector change events
        if (DOM.modelSelectorAccuracy) {
            DOM.modelSelectorAccuracy.addEventListener('change', () => {
                updateClassAccuracyChart(DOM.modelSelectorAccuracy.value);
            });
        }
        
        if (DOM.modelSelectorConfusion) {
            DOM.modelSelectorConfusion.addEventListener('change', () => {
                updateConfusionMatrix(DOM.modelSelectorConfusion.value);
            });
        }
        
        if (DOM.modelSelectorHistory) {
            DOM.modelSelectorHistory.addEventListener('change', () => {
                updateTrainingHistoryChart(DOM.modelSelectorHistory.value);
            });
        }
        
        if (DOM.modelSelectorResource) {
            DOM.modelSelectorResource.addEventListener('change', () => {
                updateResourceUsageChart(DOM.modelSelectorResource.value);
            });
        }
    }

    function initializeComparisonChart() {
        // Destroy existing chart if it exists
        if (STATE.charts.comparisonChart) {
            STATE.charts.comparisonChart.destroy();
        }
        
        // Create data for comparison chart
        const modelNames = STATE.models.map(model => model.name);
        const accuracyData = STATE.models.map(model => parseFloat(model.accuracy));
        const modelColors = STATE.models.map(model => getModelTypeColor(model.type));
        
        // Create comparison chart
        STATE.charts.comparisonChart = new Chart(DOM.comparisonChart, {
            type: 'bar',
            data: {
                labels: modelNames,
                datasets: [{
                    label: 'Accuracy (%)',
                    data: accuracyData,
                    backgroundColor: modelColors.map(color => hexToRgba(color, 0.7)),
                    borderColor: modelColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Accuracy (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Models'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Accuracy: ${context.parsed.y.toFixed(2)}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    function initializeClassAccuracyChart() {
        // Destroy existing chart if it exists
        if (STATE.charts.classAccuracyChart) {
            STATE.charts.classAccuracyChart.destroy();
        }
        
        // Generate data - if no models, use placeholder data
        let classAccuracyData;
        
        if (STATE.models.length > 0) {
            // Use first model or average of all models
            const categoryNames = CONFIG.categories.map(c => c.name);
            
            // Generate pseudo class-specific accuracies based on model overall accuracy
            // In a real app, this would come from actual model evaluation
            const firstModel = STATE.models[0];
            const baseAccuracy = parseFloat(firstModel.accuracy) / 100;
            
            classAccuracyData = generateClassAccuracies(baseAccuracy);
        } else {
            // Use placeholder data
            classAccuracyData = generateClassAccuracies(0.85);
        }
        
        // Create class accuracy chart
        STATE.charts.classAccuracyChart = new Chart(DOM.classAccuracyChart, {
            type: 'radar',
            data: {
                labels: CONFIG.categories.map(c => c.name.charAt(0).toUpperCase() + c.name.slice(1)),
                datasets: [{
                    label: 'Class Accuracy (%)',
                    data: classAccuracyData,
                    backgroundColor: hexToRgba(CONFIG.chartColors.primary, 0.2),
                    borderColor: CONFIG.chartColors.primary,
                    borderWidth: 2,
                    pointBackgroundColor: CONFIG.chartColors.primary,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        pointLabels: {
                            font: {
                                size: 12
                            }
                        },
                        min: 50,
                        max: 100,
                        ticks: {
                            stepSize: 10,
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Accuracy: ${context.parsed.r.toFixed(2)}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    function initializeConfusionMatrix() {
        // Destroy existing chart if it exists
        if (STATE.charts.confusionMatrix) {
            STATE.charts.confusionMatrix.destroy();
        }
        
        // Create confusion matrix
