/**
 * CIFAR-10 Nexus - Advanced Dataset Explorer
 * Version 3.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    /**
     * Configuration and Constants
     * ===========================
     */
    const config = {
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
        baseUrl: 'datasets/cifar-10/images/',
        defaultSet: 'train',
        storagePrefixKey: 'cifar10nexus_',
        networkArchitectures: {
            cnn: {
                description: 'A basic Convolutional Neural Network with 3 convolutional layers. Good for beginners and quick experiments.',
                parameters: 1200000,
                baseAccuracy: 0.82,
                size: '2.4 MB',
                trainingTime: '5-10 minutes'
            },
            resnet: {
                description: 'A ResNet-based architecture with residual connections for better gradient flow. Good for deeper networks and higher accuracy.',
                parameters: 11000000,
                baseAccuracy: 0.89,
                size: '8.7 MB',
                trainingTime: '15-20 minutes'
            },
            mobilenet: {
                description: 'A MobileNetV2 architecture optimized for mobile and edge devices. Balances efficiency and accuracy.',
                parameters: 2300000,
                baseAccuracy: 0.87,
                size: '3.8 MB',
                trainingTime: '8-12 minutes'
            },
            efficientnet: {
                description: 'An EfficientNet-B0 architecture that optimizes both accuracy and computational efficiency. Advanced model with compound scaling.',
                parameters: 5300000,
                baseAccuracy: 0.91,
                size: '5.6 MB',
                trainingTime: '12-18 minutes'
            }
        }
    };

    /**
     * DOM Element References
     * =====================
     */
    const elements = {
        // Navigation
        navItems: document.querySelectorAll('.nav-item'),
        menuToggle: document.getElementById('menu-toggle'),
        navMenu: document.querySelector('.nav-menu'),
        
        // Theme and UI
        themeToggle: document.getElementById('theme-toggle'),
        refreshDataBtn: document.getElementById('refresh-data'),
        
        // Content sections
        contentSections: document.querySelectorAll('.content-section'),
        
        // Dashboard
        statValues: document.querySelectorAll('.stat-value'),
        categoryContainer: document.getElementById('category-container'),
        tabs: document.querySelectorAll('.tab'),
        
        // Dataset
        categoryList: document.getElementById('category-list'),
        imagesGrid: document.getElementById('images-grid'),
        
        // Training
        trainingForm: document.getElementById('training-form'),
        modelTypeSelect: document.getElementById('model-type'),
        epochsRange: document.getElementById('epochs-range'),
        epochsInput: document.getElementById('epochs'),
        resetFormBtn: document.getElementById('reset-form-btn'),
        startTrainingBtn: document.getElementById('start-training-btn'),
        trainingProgressContainer: document.getElementById('training-progress-container'),
        trainingTime: document.getElementById('training-time'),
        currentEpoch: document.getElementById('current-epoch'),
        currentAccuracy: document.getElementById('current-accuracy'),
        trainingEta: document.getElementById('training-eta'),
        trainingProgressBar: document.getElementById('training-progress-bar'),
        progressPercentage: document.getElementById('progress-percentage'),
        trainingLog: document.getElementById('training-log'),
        cancelTrainingBtn: document.getElementById('cancel-training-btn'),
        pauseTrainingBtn: document.getElementById('pause-training-btn'),
        
        // Models
        modelsContainer: document.getElementById('models-container'),
        emptyModels: document.getElementById('empty-models'),
        
        // Analytics charts
        comparisonChart: document.getElementById('comparison-chart'),
        classAccuracyChart: document.getElementById('class-accuracy-chart'),
        confusionMatrix: document.getElementById('confusion-matrix'),
        trainingHistoryChart: document.getElementById('training-history-chart'),
        resourceUsageChart: document.getElementById('resource-usage-chart'),
        
        // Modals
        imageViewerModal: document.getElementById('image-viewer-modal'),
        showcaseImage: document.getElementById('showcase-image'),
        imageCategory: document.getElementById('image-category'),
        imageSet: document.getElementById('image-set'),
        downloadImageBtn: document.getElementById('download-image-btn'),
        modalCloseBtns: document.querySelectorAll('.modal-close, .modal-close-btn'),
        
        // Toast container
        toastContainer: document.getElementById('toast-container')
    };

    /**
     * Application State
     * ================
     */
    let state = {
        currentSection: 'dashboard',
        currentSet: config.defaultSet,
        darkMode: loadFromStorage('darkMode') || true,
        activeCategory: null,
        training: {
            inProgress: false,
            paused: false,
            progress: 0,
            currentEpoch: 0,
            totalEpochs: 10,
            startTime: null,
            elapsedTime: 0,
            model: null,
            logs: [],
            metrics: {
                trainAccuracy: [],
                valAccuracy: [],
                trainLoss: [],
                valLoss: []
            }
        },
        models: loadFromStorage('models') || [],
        dataRefreshing: false,
        viewedCategories: loadFromStorage('viewedCategories') || [],
        chartInstances: {}
    };

    /**
     * Initialization
     * =============
     */
    function initializeApp() {
        // Apply initial theme
        applyTheme();
        
        // Animate stat counters
        animateStatCounters();
        
        // Render categories
        renderCategories();
        renderCategoryList();
        
        // Load saved models
        checkForSavedModels();
        
        // Set up training form linkages
        setupTrainingForm();
        
        // Initialize charts if available
        initializeCharts();
    }

    /**
     * Event Listeners and UI Interactions
     * =================================
     */
    function setupEventListeners() {
        // Navigation
        elements.navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.dataset.section;
                navigateToSection(section);
            });
        });
        
        // Mobile menu toggle
        if (elements.menuToggle) {
            elements.menuToggle.addEventListener('click', () => {
                elements.navMenu.classList.toggle('show');
            });
        }
        
        // Theme toggle
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', toggleTheme);
        }
        
        // Tab switching
        elements.tabs.forEach(tab => {
            tab.addEventListener('click', handleTabClick);
        });
        
        // Training form
        if (elements.resetFormBtn) {
            elements.resetFormBtn.addEventListener('click', resetTrainingForm);
        }
        
        if (elements.startTrainingBtn) {
            elements.startTrainingBtn.addEventListener('click', startTraining);
        }
        
        // Training controls
        if (elements.cancelTrainingBtn) {
            elements.cancelTrainingBtn.addEventListener('click', cancelTraining);
        }
        
        if (elements.pauseTrainingBtn) {
            elements.pauseTrainingBtn.addEventListener('click', togglePauseTraining);
        }
        
        // Form input linkages
        if (elements.epochsRange && elements.epochsInput) {
            elements.epochsRange.addEventListener('input', () => {
                elements.epochsInput.value = elements.epochsRange.value;
            });
            
            elements.epochsInput.addEventListener('input', () => {
                elements.epochsRange.value = elements.epochsInput.value;
            });
        }
        
        // Modal close buttons
        elements.modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) hideModal(modal);
            });
        });
        
        // Refresh data button
        if (elements.refreshDataBtn) {
            elements.refreshDataBtn.addEventListener('click', refreshData);
        }
        
        // Window resize event for responsive behavior
        window.addEventListener('resize', handleWindowResize);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }

    function navigateToSection(section) {
        // Update state
        state.currentSection = section;
        
        // Update active nav item
        elements.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });
        
        // Hide mobile menu if open
        elements.navMenu.classList.remove('show');
        
        // Show active section
        elements.contentSections.forEach(contentSection => {
            contentSection.classList.toggle('active', contentSection.id === section);
        });
        
        // Special behavior for certain sections
        if (section === 'analytics' && window.Chart) {
            updateAnalyticsCharts();
        }
    }

    function toggleTheme() {
        state.darkMode = !state.darkMode;
        applyTheme();
        saveToStorage('darkMode', state.darkMode);
        
        // Update icon
        elements.themeToggle.innerHTML = state.darkMode ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
        
        // Show toast notification
        showToast(state.darkMode ? 'Dark theme enabled' : 'Light theme enabled', 'info');
    }

    function applyTheme() {
        document.body.classList.toggle('theme-light', !state.darkMode);
        document.body.classList.toggle('theme-default', state.darkMode);
    }

    /**
     * Dashboard Components
     * ==================
     */
    function animateStatCounters() {
        elements.statValues.forEach(valueElement => {
            const targetValue = parseInt(valueElement.dataset.count, 10);
            if (!isNaN(targetValue)) {
                animateCounter(valueElement, 0, targetValue, 2000);
            }
        });
    }

    function animateCounter(element, start, end, duration) {
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = numberWithCommas(current);
            
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                element.textContent = numberWithCommas(end);
                clearInterval(timer);
            }
        }, stepTime);
    }

    function renderCategories() {
        if (!elements.categoryContainer) return;
        
        elements.categoryContainer.innerHTML = '';
        
        config.categories.forEach(category => {
            const count = state.currentSet === 'train' ? category.trainCount : category.testCount;
            const viewedClass = state.viewedCategories.includes(category.name) ? 'viewed' : '';
            
            const cardHtml = `
                <div class="category-card ${viewedClass}" data-category="${category.name}">
                    <div class="category-icon" style="background: linear-gradient(135deg, ${category.color}, var(--accent))">
                        <i class="${category.icon}"></i>
                    </div>
                    <h3>${category.name.charAt(0).toUpperCase() + category.name.slice(1)}</h3>
                    <div class="image-count">${numberWithCommas(count)} images</div>
                    <button class="btn btn-gradient view-category-btn" data-category="${category.name}">
                        <i class="fas fa-eye"></i> View Images
                    </button>
                </div>
            `;
            
            elements.categoryContainer.insertAdjacentHTML('beforeend', cardHtml);
        });
        
        // Add event listeners to view buttons
        const viewButtons = document.querySelectorAll('.view-category-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                viewCategoryImages(category);
            });
        });
    }

    function handleTabClick() {
        // Update active tab
        elements.tabs.forEach(tab => tab.classList.remove('active'));
        this.classList.add('active');
        
        // Update current set in state
        state.currentSet = this.dataset.tab;
        
        // Re-render categories with updated counts
        renderCategories();
    }

    function renderCategoryList() {
        if (!elements.categoryList) return;
        
        elements.categoryList.innerHTML = '';
        
        config.categories.forEach(category => {
            const listItem = document.createElement('li');
            listItem.dataset.category = category.name;
            listItem.innerHTML = `
                <i class="${category.icon}" style="color: ${category.color}"></i>
                <span>${category.name.charAt(0).toUpperCase() + category.name.slice(1)}</span>
            `;
            
            listItem.addEventListener('click', () => {
                // Update active category
                const prevActive = elements.categoryList.querySelector('li.active');
                if (prevActive) prevActive.classList.remove('active');
                listItem.classList.add('active');
                
                // Load category images
                state.activeCategory = category.name;
                loadCategoryImages(category.name);
            });
            
            elements.categoryList.appendChild(listItem);
        });
    }

    function viewCategoryImages(category) {
        // Add to viewed categories list
        if (!state.viewedCategories.includes(category)) {
            state.viewedCategories.push(category);
            saveToStorage('viewedCategories', state.viewedCategories);
        }
        
        // Navigate to dataset section
        navigateToSection('dataset');
        
        // Select category in list
        const categoryItem = document.querySelector(`#category-list li[data-category="${category}"]`);
        if (categoryItem) {
            const prevActive = elements.categoryList.querySelector('li.active');
            if (prevActive) prevActive.classList.remove('active');
            categoryItem.classList.add('active');
            
            // Simulate click on category
            state.activeCategory = category;
            loadCategoryImages(category);
        }
    }

    function loadCategoryImages(category) {
        if (!elements.imagesGrid) return;
        
        // Show loading state
        elements.imagesGrid.innerHTML = `
            <div class="empty-state">
                <div class="loading-spinner"></div>
                <p>Loading ${category} images...</p>
            </div>
        `;
        
        // In a real application, we would fetch actual images from a server
        // For this demo, we'll simulate image loading with a delay
        setTimeout(() => {
            elements.imagesGrid.innerHTML = '';
            
            // Generate placeholders for images (in a real app, these would be actual images)
            const count = state.currentSet === 'train' ? 24 : 12;
            for (let i = 1; i <= count; i++) {
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                
                // Use a colored div as placeholder (in real app, use actual img tags)
                const color = config.categories.find(c => c.name === category)?.color || '#3b82f6';
                
                imageItem.innerHTML = `
                    <div style="background-color: ${color}40; width: 100%; height: 100%; 
                        display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md);">
                        <span style="color: ${color}; font-size: 12px; font-weight: 500;">${i}</span>
                    </div>
                `;
                
                // Add click event to show large image in modal
                imageItem.addEventListener('click', () => {
                    showImageViewer(category, i);
                });
                
                elements.imagesGrid.appendChild(imageItem);
            }
            
            // Update pagination
            document.querySelector('.pagination span').textContent = `Page 1 of ${state.currentSet === 'train' ? '208' : '42'}`;
        }, 800);
    }

    function showImageViewer(category, index) {
        if (!elements.imageViewerModal) return;
        
        // Set image details
        elements.imageCategory.textContent = category;
        elements.imageSet.textContent = state.currentSet;
        
        // In a real app, set the actual image src
        // For demo, use a colored div
        const color = config.categories.find(c => c.name === category)?.color || '#3b82f6';
        elements.showcaseImage.style.backgroundColor = `${color}40`;
        elements.showcaseImage.style.width = '256px';
        elements.showcaseImage.style.height = '256px';
        elements.showcaseImage.style.display = 'flex';
        elements.showcaseImage.style.alignItems = 'center';
        elements.showcaseImage.style.justifyContent = 'center';
        elements.showcaseImage.style.fontSize = '24px';
        elements.showcaseImage.style.fontWeight = '500';
        elements.showcaseImage.style.color = color;
        elements.showcaseImage.textContent = `${category} ${index}`;
        
        // Show modal
        showModal(elements.imageViewerModal);
    }

    /**
     * Training and Models
     * =================
     */
    function setupTrainingForm() {
        if (!elements.epochsRange || !elements.epochsInput) return;
        
        // Sync the range and number inputs
        elements.epochsRange.addEventListener('input', () => {
            elements.epochsInput.value = elements.epochsRange.value;
        });
        
        elements.epochsInput.addEventListener('input', () => {
            elements.epochsRange.value = elements.epochsInput.value;
        });
    }

    function resetTrainingForm() {
        if (!elements.trainingForm) return;
        
        elements.trainingForm.reset();
        
        // Reset the range input in case it wasn't properly reset
        if (elements.epochsRange && elements.epochsInput) {
            elements.epochsRange.value = elements.epochsInput.value;
        }
        
        // Log message
        logTrainingMessage('Training form reset. Ready to start new training.');
    }

    function startTraining() {
        if (state.training.inProgress) {
            showToast('Training is already in progress', 'warning');
            return;
        }
        
        // Get form values
        const modelType = elements.modelTypeSelect.value;
        const epochs = parseInt(elements.epochsInput.value, 10);
        const batchSize = document.getElementById('batch-size').value;
        const learningRate = document.getElementById('learning-rate').value;
        
        // Data augmentation options
        const useFlip = document.getElementById('aug-flip').checked;
        const useRotation = document.getElementById('aug-rotation').checked;
        const useShift = document.getElementById('aug-shift').checked;
        const useZoom = document.getElementById('aug-zoom').checked;
        
        // Update state
        state.training = {
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
            dataAugmentation: { useFlip, useRotation, useShift, useZoom },
            metrics: {
                trainAccuracy: [],
                valAccuracy: [],
                trainLoss: [],
                valLoss: []
            },
            logs: []
        };
        
        // Show training progress container
        elements.trainingProgressContainer.classList.remove('hidden');
        
        // Hide training form container
        elements.trainingForm.closest('.training-panel').classList.add('hidden');
        
        // Clear training log
        elements.trainingLog.innerHTML = '';
        
        // Initialize charts
        if (window.Chart) {
            initializeTrainingCharts();
        }
        
        // Log initial message
        logTrainingMessage(`Starting training with ${modelType.toUpperCase()} model, ${epochs} epochs, batch size ${batchSize}`);
        logTrainingMessage(`Learning rate: ${learningRate}, Augmentation: ${useFlip ? 'Flips, ' : ''}${useRotation ? 'Rotation, ' : ''}${useShift ? 'Shifts, ' : ''}${useZoom ? 'Zoom' : ''}`, 'command');
        logTrainingMessage('Loading CIFAR-10 dataset...');
        
        // Start training simulation
        startTrainingSimulation();
    }

    function startTrainingSimulation() {
        // Start timer for elapsed time
        let timerInterval = setInterval(() => {
            if (!state.training.paused) {
                state.training.elapsedTime += 1;
                updateTrainingUI();
            }
        }, 1000);
        
        // Simulate loading dataset
        setTimeout(() => {
            logTrainingMessage('Dataset loaded successfully: 50,000 training images, 10,000 test images');
            logTrainingMessage(`Building ${state.training.modelType.toUpperCase()} architecture...`);
            
            // Simulate model building
            setTimeout(() => {
                const modelInfo = config.networkArchitectures[state.training.modelType];
                logTrainingMessage(`Model created with ${numberWithCommas(modelInfo.parameters)} parameters`);
                logTrainingMessage('Compiling model with Adam optimizer and categorical cross-entropy loss');
                logTrainingMessage('Starting training...', 'success');
                
                // Start the epoch simulation
                simulateTrainingEpochs(timerInterval);
            }, 1500);
        }, 2000);
    }

    function simulateTrainingEpochs(timerInterval) {
        const totalEpochs = state.training.totalEpochs;
        let currentEpoch = 0;
        
        // Get base accuracy from model architecture
        const modelInfo = config.networkArchitectures[state.training.modelType];
        const baseAccuracy = modelInfo.baseAccuracy;
        
        // Adjust for learning rate and data augmentation
        let accuracyMultiplier = 1.0;
        if (state.training.learningRate === '0.01') accuracyMultiplier *= 0.95;
        if (state.training.learningRate === '0.0001') accuracyMultiplier *= 1.02;
        if (state.training.dataAugmentation.useFlip) accuracyMultiplier *= 1.03;
        if (state.training.dataAugmentation.useRotation) accuracyMultiplier *= 1.02;
        if (state.training.dataAugmentation.useShift) accuracyMultiplier *= 1.01;
        if (state.training.dataAugmentation.useZoom) accuracyMultiplier *= 1.02;
        
        // Epoch runner function
        function runEpoch() {
            if (state.training.paused) {
                // If training is paused, check again in 500ms
                setTimeout(runEpoch, 500);
                return;
            }
            
            if (!state.training.inProgress) {
                // Training was cancelled
                clearInterval(timerInterval);
                return;
            }
            
            currentEpoch++;
            
            // Update state
            state.training.currentEpoch = currentEpoch;
            state.training.progress = Math.round((currentEpoch / totalEpochs) * 100);
            
            // Generate metrics for this epoch
            // Start lower and improve over time with some randomness
            const learningCurve = 1 - Math.exp(-currentEpoch / (totalEpochs * 0.4));
            
            const trainAcc = Math.min(
                (baseAccuracy - 0.2) + (0.2 * learningCurve * accuracyMultiplier) + (Math.random() * 0.02 - 0.01),
                baseAccuracy * accuracyMultiplier
            );
            
            const valAcc = Math.min(
                (baseAccuracy - 0.25) + (0.25 * learningCurve * accuracyMultiplier) + (Math.random() * 0.03 - 0.015),
                baseAccuracy * 0.99 * accuracyMultiplier
            );
            
            const trainLoss = Math.max(
                1.5 - (1.3 * learningCurve) + (Math.random() * 0.05 - 0.025),
                0.1
            );
            
            const valLoss = Math.max(
                1.7 - (1.4 * learningCurve) + (Math.random() * 0.08 - 0.04),
                0.2
            );
            
            // Save metrics to state
            state.training.metrics.trainAccuracy.push(trainAcc);
            state.training.metrics.valAccuracy.push(valAcc);
            state.training.metrics.trainLoss.push(trainLoss);
            state.training.metrics.valLoss.push(valLoss);
            
            // Update UI
            updateTrainingUI();
            
            // Update charts
            updateTrainingCharts();
            
            // Log epoch result
            logTrainingMessage(`Epoch ${currentEpoch}/${totalEpochs}: loss: ${trainLoss.toFixed(4)} - accuracy: ${(trainAcc * 100).toFixed(2)}% - val_loss: ${valLoss.toFixed(4)} - val_accuracy: ${(valAcc * 100).toFixed(2)}%`);
            
            // Continue or finish
            if (currentEpoch < totalEpochs) {
                // Random time per epoch based on model complexity
                const complexity = modelInfo.parameters / 1000000; // In millions
                const baseTime = 800;
                const variableTime = 200 * complexity;
                const epochTime = baseTime + variableTime + (Math.random() * 300);
                
                setTimeout(runEpoch, epochTime);
            } else {
                finishTraining(valAcc);
                clearInterval(timerInterval);
            }
        }
        
        // Start the first epoch
        setTimeout(runEpoch, 1000);
    }

    function updateTrainingUI() {
        if (!state.training.inProgress) return;
        
        // Update progress bar
        elements.trainingProgressBar.style.width = `${state.training.progress}%`;
        elements.progressPercentage.textContent = `${state.training.progress}%`;
        
        // Update stats
        elements.currentEpoch.textContent = `${state.training.currentEpoch}/${state.training.totalEpochs}`;
        
        // Format elapsed time
        const elapsedTime = formatTime(state.training.elapsedTime);
        elements.trainingTime.textContent = elapsedTime;
        
        // Update current accuracy
        const latestAccuracy = state.training.metrics.valAccuracy[state.training.metrics.valAccuracy.length - 1];
        if (latestAccuracy) {
            elements.currentAccuracy.textContent = `${(latestAccuracy * 100).toFixed(2)}%`;
        }
        
        // Calculate and update ETA
        if (state.training.currentEpoch > 0) {
            const timePerEpoch = state.training.elapsedTime / state.training.currentEpoch;
            const remainingEpochs = state.training.totalEpochs - state.training.currentEpoch;
            const estimatedRemainingTime = timePerEpoch * remainingEpochs;
            
            if (estimatedRemainingTime > 0) {
                elements.trainingEta.textContent = formatTime(estimatedRemainingTime);
            }
        }
    }

    function logTrainingMessage(message, type = '') {
        if (!elements.trainingLog) return;
        
        // Create paragraph element
        const p = document.createElement('p');
        p.textContent = message;
        
        if (type) {
            p.classList.add(type);
        }
        
        // Add to DOM
        elements.trainingLog.appendChild(p);
        
        // Scroll to bottom
        elements.trainingLog.scrollTop = elements.trainingLog.scrollHeight;
    }

    function finishTraining(finalAccuracy) {
        // Record training metrics
        const trainingTime = state.training.elapsedTime;
        
        // Log completion
        logTrainingMessage(`Training completed in ${formatTime(trainingTime)}.`, 'success');
        logTrainingMessage(`Final validation accuracy: ${(finalAccuracy * 100).toFixed(2)}%`, 'success');
        
        // Generate a model name
        const modelType = state.training.modelType;
        const modelName = `CIFAR10_${modelType.toUpperCase()}_${formatDate(new Date())}`;
        
        // Create model object
        const newModel = {
            id: Date.now(),
            name: modelName,
            type: modelType,
            accuracy: (finalAccuracy * 100).toFixed(2),
            parameters: numberWithCommas(config.networkArchitectures[modelType].parameters),
            date: formatDate(new Date()),
            trainingTime: formatTime(trainingTime),
            size: config.networkArchitectures[modelType].size,
            description: config.networkArchitectures[modelType].description,
            metrics: state.training.metrics
        };
        
        // Add to saved models
        state.models.push(newModel);
        saveToStorage('models', state.models);
        
        // Update models list
        renderModels();
        
        // Reset training state
        state.training.inProgress = false;
        
        // Update UI
        elements.pauseTrainingBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        
        // Show success notification
        showToast(`Training complete! Model saved as ${modelName}`, 'success');
        
        // Reset UI for new training
        setTimeout(() => {
            // Show training form container again
            elements.trainingForm.closest('.training-panel').classList.remove('hidden');
            
            // Hide training progress container
            elements.trainingProgressContainer.classList.add('hidden');
        }, 3000);
    }

    function cancelTraining() {
        if (!state.training.inProgress) return;
        
        // Confirm before cancelling
        if (confirm('Are you sure you want to cancel this training session? All progress will be lost.')) {
            state.training.inProgress = false;
            
            // Show training form container again
            elements.trainingForm.closest('.training-panel').classList.remove('hidden');
            
            // Hide training progress container
            elements.trainingProgressContainer.classList.add('hidden');
            
            // Show notification
            showToast('Training cancelled', 'warning');
        }
    }

    function togglePauseTraining() {
        if (!state.training.inProgress) return;
        
        state.training.paused = !state.training.paused;
        
        // Update button text
        elements.pauseTrainingBtn.innerHTML = state.training.paused ? 
            '<i class="fas fa-play"></i> Resume' : 
            '<i class="fas fa-pause"></i> Pause';
        
        // Log message
        logTrainingMessage(state.training.paused ? 'Training paused' : 'Training resumed', 
            state.training.paused ? 'warning' : 'success');
            
        // Show notification
        showToast(state.training.paused ? 'Training paused' : 'Training resumed', 
            state.training.paused ? 'warning' : 'info');
    }

    function checkForSavedModels() {
        // Load models from storage
        const savedModels = loadFromStorage('models');
        if (savedModels && savedModels.length > 0) {
            state.models = savedModels;
        } else if (state.models.length === 0) {
            // Add a sample model for demo purposes
            state.models.push({
                id: 1,
                name: 'CIFAR10_RESNET_Demo',
                type: 'resnet',
                accuracy: '89.42',
                parameters: '11,173,962',
                date: '2025-05-19',
                trainingTime: '15m 42s',
                size: '8.7 MB',
                description: 'A ResNet-based architecture with higher accuracy but larger size. Includes skip connections for better gradient flow.',
                metrics: {
                    trainAccuracy: [0.52, 0.61, 0.67, 0.72, 0.76, 0.79, 0.82, 0.85, 0.88, 0.91],
                    valAccuracy: [0.49, 0.57, 0.64, 0.69, 0.74, 0.78, 0.82, 0.85, 0.87, 0.89],
                    trainLoss: [1.45, 1.20, 1.02, 0.85, 0.73, 0.60, 0.52, 0.45, 0.40, 0.35],
                    valLoss: [1.62, 1.35, 1.15, 0.98, 0.85, 0.77, 0.68, 0.61, 0.55, 0.51]
                }
            });
        }
        
        // Render models
        renderModels();
    }

    function renderModels() {
        if (!elements.modelsContainer || !elements.emptyModels) return;
        
        if (state.models.length === 0) {
            elements.emptyModels.classList.remove('hidden');
            return;
        }
        
        // Hide empty state
        elements.emptyModels.classList.add('hidden');
        
        // Clear container (except empty state)
        Array.from(elements.modelsContainer.children).forEach(child => {
            if (!child.id || child.id !== 'empty-models') {
                child.remove();
            }
        });
        
        // Add model cards
        state.models.forEach((model, index) => {
            const modelCard = document.createElement('div');
            modelCard.className = 'model-card';
            modelCard.dataset.id = model.id;
            
            // Get color based on model type
            const modelColor = getModelColor(model.type);
            
            modelCard.innerHTML = `
                <div class="model-content">
                    <div class="model-title">
                        <i class="fas fa-cube" style="color: ${modelColor}"></i>
                        <h4>${model.name}</h4>
                    </div>
                    <div class="model-meta">
                        <div class="model-meta-item">
                            <i class="fas fa-chart-line"></i>
                            <span>Accuracy: ${model.accuracy}%</span>
                        </div>
                        <div class="model-meta-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${model.date}</span>
                        </div>
                        <div class="model-meta-item">
                            <i class="fas fa-microchip"></i>
                            <span>${model.parameters} params</span>
                        </div>
                        <div class="model-meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${model.trainingTime}</span>
                        </div>
                    </div>
                    <div class="model-description">
                        ${model.description}
                    </div>
                </div>
                <div class="model-actions">
                    <button class="btn btn-sm btn-outline-light view-model-btn" data-id="${model.id}">
                        <i class="fas fa-chart-bar"></i> Performance
                    </button>
                    <button class="btn btn-sm btn-primary download-model-btn" data-id="${model.id}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            `;
            
            // Add event listeners
            modelCard.querySelector('.view-model-btn').addEventListener('click', () => {
                viewModelDetails(model.id);
            });
            
            modelCard.querySelector('.download-model-btn').addEventListener('click', () => {
                downloadModel(model.id);
            });
            
            // Add animation delay for staggered appearance
            modelCard.style.animationDelay = `${index * 100}ms`;
            
            // Add to container
            elements.modelsContainer.appendChild(modelCard);
        });
    }

    function viewModelDetails(modelId) {
        // Find the model
        const model = state.models.find(m => m.id == modelId);
        if (!model) return;
        
        // Navigate to analytics section
        navigateToSection('analytics');
        
        // Update model selector dropdowns if they exist
        const selectors = [
            document.getElementById('model-selector-accuracy'),
            document.getElementById('model-selector-confusion'),
            document.getElementById('model-selector-history'),
            document.getElementById('model-selector-resource')
        ];
        
        selectors.forEach(selector => {
            if (selector) {
                // Add model option if it doesn't exist
                if (!selector.querySelector(`option[value="${model.id}"]`)) {
                    const option = document.createElement('option');
                    option.value = model.id;
                    option.textContent = model.name;
                    selector.appendChild(option);
                }
                
                // Select the model
                selector.value = model.id;
                
                // Trigger change event to update charts
                const event = new Event('change');
                selector.dispatchEvent(event);
            }
        });
        
        // Update analytics charts
        updateAnalyticsCharts(model.id);
        
        // Show toast notification
        showToast(`Viewing performance details for ${model.name}`, 'info');
    }

    function downloadModel(modelId) {
        // Find the model
        const model = state.models.find(m => m.id == modelId);
        if (!model) return;
        
        // In a real app, this would download an actual file
        // For demo purposes, show a toast notification
        showToast(`Downloading model ${model.name}...`, 'info');
        
        // Simulate download delay
        setTimeout(() => {
            showToast(`Model ${model.name} downloaded successfully!`, 'success');
        }, 2000);
    }

    /**
     * Charts and Visualizations
     * =======================
     */
    function initializeCharts() {
        if (!window.Chart) return;
        
        // Set default chart options
        Chart.defaults.color = '#cbd5e1';
        Chart.defaults.font.family = 'Inter, sans-serif';
        Chart.defaults.font.size = 12;
        Chart.defaults.elements.line.tension = 0.4;
        Chart.defaults.elements.line.borderWidth = 2;
        Chart.defaults.elements.point.radius = 3;
        Chart.defaults.elements.point.hoverRadius = 5;
        Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.8)';
        Chart.defaults.plugins.tooltip.titleFont = { weight: 'bold' };
        Chart.defaults.plugins.legend.labels.padding = 10;
        
        // Initialize training charts if in training section
        if (state.currentSection === 'models') {
            initializeTrainingCharts();
        }
        
        // Initialize analytics charts if in analytics section
        if (state.currentSection === 'analytics') {
            initializeAnalyticsCharts();
        }
    }

    function initializeTrainingCharts() {
        if (!window.Chart) return;
        
        // Accuracy chart
        const accuracyCtx = document.getElementById('accuracy-chart');
        if (accuracyCtx && !state.chartInstances.accuracyChart) {
            state.chartInstances.accuracyChart = new Chart(accuracyCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Training',
                            data: [],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true
                        },
                        {
                            label: 'Validation',
                            data: [],
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            min: 0,
                            max: 1,
                            ticks: {
                                callback: value => `${(value * 100).toFixed(0)}%`
                            }
                        }
                    }
                }
            });
        }
        
        // Loss chart
        const lossCtx = document.getElementById('loss-chart');
        if (lossCtx && !state.chartInstances.lossChart) {
            state.chartInstances.lossChart = new Chart(lossCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Training',
                            data: [],
                            borderColor: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            fill: true
                        },
                        {
                            label: 'Validation',
                            data: [],
                            borderColor: '#f59e0b',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    }
                }
            });
        }
    }

    function updateTrainingCharts() {
        if (!window.Chart) return;
        
        // Create epoch labels
        const labels = Array.from({ length: state.training.currentEpoch }, (_, i) => i + 1);
        
        // Update accuracy chart
        if (state.chartInstances.accuracyChart) {
            state.chartInstances.accuracyChart.data.labels = labels;
            state.chartInstances.accuracyChart.data.datasets[0].data = state.training.metrics.trainAccuracy;
            state.chartInstances.accuracyChart.data.datasets[1].data = state.training.metrics.valAccuracy;
            state.chartInstances.accuracyChart.update();
        }
        
        // Update loss chart
        if (state.chartInstances.lossChart) {
            state.chartInstances.lossChart.data.labels = labels;
            state.chartInstances.lossChart.data.datasets[0].data = state.training.metrics.trainLoss;
            state.chartInstances.lossChart.data.datasets[1].data = state.training.metrics.valLoss;
            state.chartInstances.lossChart.update();
        }
    }

    function initializeAnalyticsCharts() {
        if (!window.Chart || state.models.length === 0) return;
        
        // Model comparison chart
        if (elements.comparisonChart && !state.chartInstances.comparisonChart) {
            state.chartInstances.comparisonChart = new Chart(elements.comparisonChart, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Accuracy (%)',
                        data: [],
                        backgroundColor: [],
                        borderColor: [],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
        
        // Class accuracy chart
        if (elements.classAccuracyChart && !state.chartInstances.classAccuracyChart) {
            state.chartInstances.classAccuracyChart = new Chart(elements.classAccuracyChart, {
                type: 'radar',
                data: {
                    labels: config.categories.map(c => c.name),
                    datasets: [{
                        label: 'Class Accuracy (%)',
                        data: [],
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        borderColor: '#6366f1',
                        borderWidth: 2,
                        pointBackgroundColor: '#6366f1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            min: 50,
                            max: 100,
                            ticks: {
                                stepSize: 10
                            }
                        }
                    }
                }
            });
        }
        
        // Training history chart
        if (elements.trainingHistoryChart && !state.chartInstances.trainingHistoryChart) {
            state.chartInstances.trainingHistoryChart = new Chart(elements.trainingHistoryChart, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Training Accuracy',
                            data: [],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: false
                        },
                        {
                            label: 'Validation Accuracy',
                            data: [],
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            min: 0.4,
                            max: 1,
                            ticks: {
                                callback: value => `${(value * 100).toFixed(0)}%`
                            }
                        }
                    }
                }
            });
        }
        
        // Confusion matrix (simplified as heatmap)
        if (elements.confusionMatrix && !state.chartInstances.confusionMatrix) {
            // Create a simplified confusion matrix (in a real app, would use actual data)
            const labels = config.categories.map(c => c.name.slice(0, 3)); // First 3 chars for brevity
            const data = Array(10).fill().map(() => Array(10).fill(0));
            
            // Generate example data with high values on diagonal (correct predictions)
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    if (i === j) {
                        data[i][j] = 80 + Math.floor(Math.random() * 15); // 80-95% accuracy
                    } else {
                        // More confusion between similar classes
                        const similarity = getSimilarityIndex(i, j);
                        data[i][j] = Math.floor(Math.random() * 5 * similarity);
                    }
                }
            }
            
            // Normalize to ensure rows sum to 100%
            for (let i = 0; i < 10; i++) {
                const rowSum = data[i].reduce((a, b) => a + b, 0);
                for (let j = 0; j < 10; j++) {
                    data[i][j] = (data[i][j] / rowSum) * 100;
                }
            }
            
            // Create dataset for heatmap
            const datasets = [];
            for (let i = 0; i < 10; i++) {
                datasets.push({
                    label: labels[i],
                    data: data[i],
                    backgroundColor: getGradientColors(data[i])
                });
            }
            
            state.chartInstances.confusionMatrix = new Chart(elements.confusionMatrix, {
                type: 'bar',
                data: {
                    labels,
                    datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Predicted'
                            }
                        },
                        y: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Actual'
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const label = context.dataset.label;
                                    const predictedLabel = labels[context.dataIndex];
                                    const value = context.raw.toFixed(1);
                                    return `${label} → ${predictedLabel}: ${value}%`;
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Resource usage chart
        if (elements.resourceUsageChart && !state.chartInstances.resourceUsageChart) {
            state.chartInstances.resourceUsageChart = new Chart(elements.resourceUsageChart, {
                type: 'radar',
                data: {
                    labels: ['Size', 'Training Time', 'Inference Time', 'Memory Usage'],
                    datasets: [{
                        label: 'Resource Usage (normalized)',
                        data: [0.5, 0.7, 0.4, 0.6],
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        borderColor: '#6366f1',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            min: 0,
                            max: 1
                        }
                    }
                }
            });
        }
        
        // Update charts with model data
        updateAnalyticsCharts();
    }

    function updateAnalyticsCharts(selectedModelId = null) {
        if (!window.Chart || state.models.length === 0) return;
        
        // If no specific model is selected, use all models for comparison
        const models = selectedModelId ? 
            [state.models.find(m => m.id == selectedModelId)] : 
            state.models;
        
        if (models.length === 0) return;
        
        // Update comparison chart
        if (state.chartInstances.comparisonChart) {
            const labels = models.map(m => m.name);
            const data = models.map(m => parseFloat(m.accuracy));
            const colors = models.map(m => getModelColor(m.type));
            
            state.chartInstances.comparisonChart.data.labels = labels;
            state.chartInstances.comparisonChart.data.datasets[0].data = data;
            state.chartInstances.comparisonChart.data.datasets[0].backgroundColor = colors.map(c => `${c}80`);
            state.chartInstances.comparisonChart.data.datasets[0].borderColor = colors;
            state.chartInstances.comparisonChart.update();
        }
        
        // Use the first model for other charts if multiple were selected
        const model = models[0];
        
        // Update class accuracy chart with simulated data
        if (state.chartInstances.classAccuracyChart) {
            // Generate realistic per-class accuracy data
            // Some classes are typically harder to classify
            const baseAccuracy = parseFloat(model.accuracy) / 100;
            const classAccuracies = config.categories.map((category, index) => {
                // Easier classes: airplane, automobile, ship, truck (man-made, rigid structures)
                // Medium classes: bird, deer, horse (animals with consistent shapes)
                // Harder classes: cat, dog, frog (more varied appearances, similar features)
                const difficulty = [0.05, 0.05, 0.08, 0.12, 0.08, 0.12, 0.1, 0.08, 0.05, 0.05][index];
                
                // Add some randomness around the base accuracy
                const accuracy = baseAccuracy - difficulty + (Math.random() * 0.04 - 0.02);
                
                // Ensure it's between 50% and 100%
                return Math.max(0.5, Math.min(1, accuracy)) * 100;
            });
            
            state.chartInstances.classAccuracyChart.data.datasets[0].data = classAccuracies;
            state.chartInstances.classAccuracyChart.update();
        }
        
        // Update training history chart
        if (state.chartInstances.trainingHistoryChart && model.metrics) {
            const epochs = model.metrics.trainAccuracy.length;
            const labels = Array.from({length: epochs}, (_, i) => i + 1);
            
            state.chartInstances.trainingHistoryChart.data.labels = labels;
            state.chartInstances.trainingHistoryChart.data.datasets[0].data = model.metrics.trainAccuracy;
            state.chartInstances.trainingHistoryChart.data.datasets[1].data = model.metrics.valAccuracy;
            state.chartInstances.trainingHistoryChart.update();
        }
        
        // Update resource usage chart with model-specific data
        if (state.chartInstances.resourceUsageChart) {
            // Generate normalized resource usage based on model type
            let sizeValue, trainingTimeValue, inferenceTimeValue, memoryValue;
            
            switch(model.type) {
                case 'cnn':
                    sizeValue = 0.3;
                    trainingTimeValue = 0.4;
                    inferenceTimeValue = 0.3;
                    memoryValue = 0.3;
                    break;
                case 'resnet':
                    sizeValue = 0.9;
                    trainingTimeValue = 0.8;
                    inferenceTimeValue = 0.7;
                    memoryValue = 0.9;
                    break;
                case 'mobilenet':
                    sizeValue = 0.4;
                    trainingTimeValue = 0.6;
                    inferenceTimeValue = 0.4;
                    memoryValue = 0.5;
                    break;
                case 'efficientnet':
                    sizeValue = 0.6;
                    trainingTimeValue = 0.7;
                    inferenceTimeValue = 0.5;
                    memoryValue = 0.7;
                    break;
                default:
                    sizeValue = 0.5;
                    trainingTimeValue = 0.6;
                    inferenceTimeValue = 0.5;
                    memoryValue = 0.6;
            }
            
            state.chartInstances.resourceUsageChart.data.datasets[0].data = [
                sizeValue, trainingTimeValue, inferenceTimeValue, memoryValue
            ];
            state.chartInstances.resourceUsageChart.update();
        }
    }

    /**
     * UI Utilities
     * ==========
     */
    function refreshData() {
        if (state.dataRefreshing) return;
        
        state.dataRefreshing = true;
        elements.refreshDataBtn.classList.add('disabled');
        elements.refreshDataBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i>';
        
        // Show toast notification
        showToast('Refreshing data...', 'info');
        
        // Simulate refresh delay
        setTimeout(() => {
            state.dataRefreshing = false;
            elements.refreshDataBtn.classList.remove('disabled');
            elements.refreshDataBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
            
            // Show success notification
            showToast('Data refreshed successfully!', 'success');
            
            // Re-render any data-dependent UI
            renderCategories();
            renderCategoryList();
            
            if (state.activeCategory) {
                loadCategoryImages(state.activeCategory);
            }
        }, 1500);
    }

    function showModal(modal) {
        if (!modal) return;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function hideModal(modal) {
        if (!modal) return;
        
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function showToast(message, type = 'info') {
        if (!elements.toastContainer) return;
        
        // Create icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        if (type === 'error') icon = 'times-circle';
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to container
        elements.toastContainer.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Add close event
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
        
        // Auto close after delay
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) toast.remove();
                }, 300);
            }
        }, 5000);
    }

    function handleWindowResize() {
        // Update any responsive elements or charts
        if (window.Chart) {
            // Resize all charts
            Object.values(state.chartInstances).forEach(chart => {
                if (chart && typeof chart.resize === 'function') {
                    chart.resize();
                }
            });
        }
    }

    function handleKeyboardShortcuts(e) {
        // ESC key to close modals
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => hideModal(modal));
        }
        
        // Ctrl+D for dark mode toggle
        if (e.ctrlKey && e.key.toLowerCase() === 'd') {
            e.preventDefault();
            toggleTheme();
        }
    }

    /**
     * Helper functions
     * ==============
     */
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hrs > 0) {
            return `${hrs}h ${mins}m ${secs}s`;
        } else {
            return `${mins}m ${secs}s`;
        }
    }

    function getModelColor(modelType) {
        const colorMap = {
            'cnn': '#3b82f6',    // blue
            'resnet': '#8b5cf6',  // purple
            'mobilenet': '#10b981', // green
            'efficientnet': '#f59e0b' // orange
        };
        
        return colorMap[modelType] || '#6366f1';
    }

    function getSimilarityIndex(classA, classB) {
        // Define similarity between classes (1.0 = very similar, 0.1 = very different)
        const similarityMatrix = [
            // airplane, auto, bird, cat, deer, dog, frog, horse, ship, truck
            [1.0, 0.2, 0.4, 0.1, 0.1, 0.1, 0.1, 0.1, 0.5, 0.2], // airplane
            [0.2, 1.0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.2, 0.8], // automobile
            [0.4, 0.1, 1.0, 0.3, 0.4, 0.3, 0.3, 0.3, 0.2, 0.1], // bird
            [0.1, 0.1, 0.3, 1.0, 0.3, 0.8, 0.3, 0.3, 0.1, 0.1], // cat
            [0.1, 0.1, 0.4, 0.3, 1.0, 0.4, 0.3, 0.7, 0.1, 0.1], // deer
            [0.1, 0.1, 0.3, 0.8, 0.4, 1.0, 0.3, 0.4, 0.1, 0.1], // dog
            [0.1, 0.1, 0.3, 0.3, 0.3, 0.3, 1.0, 0.2, 0.1, 0.1], // frog
            [0.1, 0.1, 0.3, 0.3, 0.7, 0.4, 0.2, 1.0, 0.1, 0.1], // horse
            [0.5, 0.2, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 1.0, 0.3], // ship
            [0.2, 0.8, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.3, 1.0]  // truck
        ];
        
        return similarityMatrix[classA][classB];
    }

    function getGradientColors(values) {
        // Convert values to colors on a gradient from red (low) to green (high)
        return values.map(value => {
            // Normalize value to 0-1 range
            const normalized = value / 100;
            
            // If value is high, use green; if low, use red
            if (normalized > 0.7) {
                return `rgba(16, 185, 129, ${normalized})`; // Green
            } else if (normalized > 0.3) {
                return `rgba(245, 158, 11, ${normalized})`; // Orange/Yellow
            } else {
                return `rgba(239, 68, 68, ${normalized})`; // Red
            }
        });
    }

    function saveToStorage(key, value) {
        try {
            const prefixedKey = config.storagePrefixKey + key;
            localStorage.setItem(prefixedKey, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    function loadFromStorage(key) {
        try {
            const prefixedKey = config.storagePrefixKey + key;
            const value = localStorage.getItem(prefixedKey);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }

    /**
     * Initialize Application
     * ====================
     */
    initializeApp();
    setupEventListeners();
});
