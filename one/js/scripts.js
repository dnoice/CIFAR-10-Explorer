document.addEventListener('DOMContentLoaded', function() {
    // App configuration
    const config = {
        categories: [
            { name: 'airplane', icon: 'fas fa-plane', trainCount: 5000, testCount: 1000 },
            { name: 'automobile', icon: 'fas fa-car', trainCount: 5000, testCount: 1000 },
            { name: 'bird', icon: 'fas fa-dove', trainCount: 5000, testCount: 1000 },
            { name: 'cat', icon: 'fas fa-cat', trainCount: 5000, testCount: 1000 },
            { name: 'deer', icon: 'fas fa-deer', trainCount: 5000, testCount: 1000 },
            { name: 'dog', icon: 'fas fa-dog', trainCount: 5000, testCount: 1000 },
            { name: 'frog', icon: 'fas fa-frog', trainCount: 5000, testCount: 1000 },
            { name: 'horse', icon: 'fas fa-horse', trainCount: 5000, testCount: 1000 },
            { name: 'ship', icon: 'fas fa-ship', trainCount: 5000, testCount: 1000 },
            { name: 'truck', icon: 'fas fa-truck', trainCount: 5000, testCount: 1000 }
        ],
        baseUrl: 'datasets/cifar-10/images/',
        defaultSet: 'train'
    };

    // Element references
    const elements = {
        // Sidebar elements
        sidebar: document.querySelector('.sidebar'),
        sidebarToggle: document.getElementById('sidebar-toggle'),
        navItems: document.querySelectorAll('.nav-item'),
        themeSwitch: document.getElementById('theme-switch'),
        
        // Section title
        sectionTitle: document.getElementById('section-title'),
        
        // Content sections
        contentSections: document.querySelectorAll('.content-section'),
        
        // Dashboard elements
        tabs: document.querySelectorAll('.tab'),
        categoryContainer: document.getElementById('category-container'),
        
        // Training elements
        trainingForm: document.getElementById('training-form'),
        resetFormBtn: document.getElementById('reset-form-btn'),
        startTrainingBtn: document.getElementById('start-training-btn'),
        trainingLog: document.getElementById('training-log'),
        progressBar: document.getElementById('training-progress'),
        progressText: document.getElementById('progress-text'),
        
        // Drawer elements
        imageDrawer: document.getElementById('image-drawer'),
        drawerContent: document.getElementById('drawer-content'),
        drawerClose: document.getElementById('drawer-close'),
        
        // Misc elements
        refreshDataBtn: document.getElementById('refresh-data-btn'),
        modelsContainer: document.getElementById('models-container'),
        emptyModels: document.getElementById('empty-models')
    };

    // State management
    let state = {
        currentSection: 'dashboard',
        currentSet: config.defaultSet,
        sidebarCollapsed: false,
        training: {
            inProgress: false,
            progress: 0,
            currentEpoch: 0,
            totalEpochs: 10,
            model: null
        },
        models: [],
        dataRefreshing: false
    };

    // Initialize the app
    initializeApp();

    // Setup event listeners
    setupEventListeners();

    // Functions
    function initializeApp() {
        renderCategories();
        checkForSavedModels();
        
        // Set initial theme
        document.body.classList.add('dark-mode');
        
        // Add animation class to logo
        document.querySelector('.logo i').classList.add('pulse');
    }

    function setupEventListeners() {
        // Sidebar toggle
        if (elements.sidebarToggle) {
            elements.sidebarToggle.addEventListener('click', toggleSidebar);
        }
        
        // Navigation
        elements.navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.dataset.section;
                navigateToSection(section);
            });
        });
        
        // Theme switch
        if (elements.themeSwitch) {
            elements.themeSwitch.addEventListener('change', toggleTheme);
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

        // Drawer close
        if (elements.drawerClose) {
            elements.drawerClose.addEventListener('click', closeDrawer);
        }

        // Refresh data
        if (elements.refreshDataBtn) {
            elements.refreshDataBtn.addEventListener('click', refreshData);
        }
    }
    
    function toggleSidebar() {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        elements.sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
    }
    
    function navigateToSection(section) {
        // Update state
        state.currentSection = section;
        
        // Update active nav item
        elements.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });
        
        // Update section title
        elements.sectionTitle.textContent = section.charAt(0).toUpperCase() + section.slice(1);
        
        // Show active section
        elements.contentSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(state.currentSection).classList.add('active');
    }
    
    function toggleTheme() {
        document.body.classList.toggle('dark-mode', elements.themeSwitch.checked);
    }

    function renderCategories() {
        if (!elements.categoryContainer) return;
        
        elements.categoryContainer.innerHTML = '';
        
        config.categories.forEach(category => {
            const count = state.currentSet === 'train' ? category.trainCount : category.testCount;
            
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="category-icon">
                    <i class="${category.icon}"></i>
                </div>
                <h3 class="card-title">${category.name.charAt(0).toUpperCase() + category.name.slice(1)}</h3>
                <div class="image-count">${count.toLocaleString()} images</div>
                <button class="btn btn-primary" data-category="${category.name}">
                    <i class="fas fa-images btn-icon"></i>
                    View Images
                </button>
            `;
            
            elements.categoryContainer.appendChild(card);
            
            // Add event listener to the button
            const button = card.querySelector('button');
            button.addEventListener('click', () => viewCategoryImages(category.name));
        });
    }

    function handleTabClick() {
        // Update active tab
        elements.tabs.forEach(tab => tab.classList.remove('active'));
        this.classList.add('active');
        
        // Update current set
        state.currentSet = this.dataset.tab;
        
        // Re-render categories with updated counts
        renderCategories();
    }

    function viewCategoryImages(category) {
        // In a production app, we would fetch images from the server
        // For our simple HTTP server, navigate to the directory
        window.location.href = `${config.baseUrl}${state.currentSet}/${category}/`;
        
        // Alternatively, we could load images into a drawer:
        // loadImagesIntoDrawer(category);
    }

    function loadImagesIntoDrawer(category) {
        if (!elements.drawerContent) return;
        
        // Show loading state
        elements.drawerContent.innerHTML = '<div class="loading">Loading images...</div>';
        
        // Open the drawer
        elements.imageDrawer.classList.add('open');
        
        // In a real app with a backend, we would fetch images here
        // For our demo, we'll simulate loading a few images
        
        setTimeout(() => {
            const imageGrid = document.createElement('div');
            imageGrid.className = 'image-grid';
            
            // Create a placeholder message since we can't dynamically load images
            // without a backend in this simple HTTP server setup
            imageGrid.innerHTML = `
                <div class="image-info">
                    <h3>${category.charAt(0).toUpperCase() + category.slice(1)} Images</h3>
                    <p>In a full implementation, this drawer would display thumbnail images from the selected category.</p>
                    <p>Currently, clicking "View Images" redirects to the directory listing provided by the HTTP server.</p>
                </div>
            `;
            
            elements.drawerContent.innerHTML = '';
            elements.drawerContent.appendChild(imageGrid);
        }, 500);
    }

    function closeDrawer() {
        elements.imageDrawer.classList.remove('open');
    }

    function resetTrainingForm() {
        if (!elements.trainingForm) return;
        
        elements.trainingForm.reset();
        logTrainingMessage('Training form reset. Ready to configure new training run.');
    }

    function startTraining() {
        if (state.training.inProgress) {
            logTrainingMessage('Training already in progress. Please wait until it completes.', 'warning');
            return;
        }
        
        // Get form values
        const modelType = document.getElementById('model-type').value;
        const batchSize = document.getElementById('batch-size').value;
        const epochs = document.getElementById('epochs').value;
        const learningRate = document.getElementById('learning-rate').value;
        const useFlip = document.getElementById('aug-flip').checked;
        const useRotation = document.getElementById('aug-rotation').checked;
        const useShift = document.getElementById('aug-shift').checked;
        
        // Update state
        state.training.inProgress = true;
        state.training.progress = 0;
        state.training.currentEpoch = 0;
        state.training.totalEpochs = parseInt(epochs);
        
        // Update UI
        elements.startTrainingBtn.disabled = true;
        elements.resetFormBtn.disabled = true;
        elements.progressBar.style.width = '0%';
        elements.progressText.textContent = 'Training starting...';
        
        // Clear log and show initial messages
        elements.trainingLog.innerHTML = '';
        logTrainingMessage(`$ python train_model.py --model ${modelType} --batch-size ${batchSize} --epochs ${epochs} --learning-rate ${learningRate} ${useFlip ? '--use-flip' : ''} ${useRotation ? '--use-rotation' : ''} ${useShift ? '--use-shift' : ''}`);
        logTrainingMessage('Loading CIFAR-10 dataset...');
        
        // Simulate dataset loading
        setTimeout(() => {
            logTrainingMessage('Loaded 50000 training and 10000 test images.');
            logTrainingMessage(`Building ${modelType.toUpperCase()} model...`);
            
            // Show model architecture based on selection
            if (modelType === 'cnn') {
                logTrainingMessage('Model architecture:');
                logTrainingMessage('- Input: (32, 32, 3)');
                logTrainingMessage('- Conv2D: 32 filters, 3x3 kernel, ReLU activation');
                logTrainingMessage('- MaxPooling2D: 2x2');
                logTrainingMessage('- Conv2D: 64 filters, 3x3 kernel, ReLU activation');
                logTrainingMessage('- MaxPooling2D: 2x2');
                logTrainingMessage('- Conv2D: 64 filters, 3x3 kernel, ReLU activation');
                logTrainingMessage('- Flatten');
                logTrainingMessage('- Dense: 64 units, ReLU activation');
                logTrainingMessage('- Dense: 10 units, Softmax activation');
            } else if (modelType === 'resnet') {
                logTrainingMessage('Model: ResNet-18');
                logTrainingMessage('Total parameters: 11,173,962');
            } else if (modelType === 'mobilenet') {
                logTrainingMessage('Model: MobileNetV2');
                logTrainingMessage('Total parameters: 2,257,984');
            }
            
            logTrainingMessage(`Compiling model with adam optimizer and sparse_categorical_crossentropy loss`);
            logTrainingMessage('Training started. This may take several minutes...', 'success');
            
            // Simulate training epochs
            simulateTrainingEpochs();
        }, 1000);
    }

    function simulateTrainingEpochs() {
        const totalEpochs = state.training.totalEpochs;
        let currentEpoch = 0;
        
        // Function to simulate one epoch
        function runEpoch() {
            currentEpoch++;
            state.training.currentEpoch = currentEpoch;
            
            // Calculate progress
            const progress = Math.round((currentEpoch / totalEpochs) * 100);
            state.training.progress = progress;
            
            // Update UI
            elements.progressBar.style.width = `${progress}%`;
            elements.progressText.textContent = `Training progress: ${progress}% (Epoch ${currentEpoch}/${totalEpochs})`;
            
            // Generate realistic-looking metrics that improve over time
            const trainAcc = 0.5 + (currentEpoch * 0.04);
            const valAcc = Math.min(0.45 + (currentEpoch * 0.035), 0.95);
            const trainLoss = Math.max(1.5 - (currentEpoch * 0.1), 0.2);
            const valLoss = Math.max(1.7 - (currentEpoch * 0.09), 0.3);
            
            // Log epoch result
            logTrainingMessage(`Epoch ${currentEpoch}/${totalEpochs}: loss: ${trainLoss.toFixed(4)} - accuracy: ${trainAcc.toFixed(4)} - val_loss: ${valLoss.toFixed(4)} - val_accuracy: ${valAcc.toFixed(4)}`);
            
            // Continue if we have more epochs
            if (currentEpoch < totalEpochs) {
                setTimeout(runEpoch, 1000); // 1 second per epoch for simulation
            } else {
                finishTraining(valAcc.toFixed(4));
            }
        }
        
        // Start the first epoch
        setTimeout(runEpoch, 1000);
    }

    function finishTraining(finalAccuracy) {
        logTrainingMessage(`Training completed with ${state.training.totalEpochs} epochs.`, 'success');
        logTrainingMessage(`Final validation accuracy: ${finalAccuracy}`, 'success');
        
        // Generate a model name
        const modelType = document.getElementById('model-type').value;
        const modelName = `CIFAR10_${modelType.toUpperCase()}_${new Date().toISOString().slice(0, 10)}`;
        
        // Add to saved models
        const newModel = {
            id: Date.now(),
            name: modelName,
            type: modelType,
            accuracy: finalAccuracy,
            date: new Date().toISOString().slice(0, 10),
            size: getRandomModelSize(modelType),
            description: getModelDescription(modelType)
        };
        
        state.models.push(newModel);
        
        // Save models to localStorage in a real app
        // localStorage.setItem('savedModels', JSON.stringify(state.models));
        
        // Update the models list
        renderModels();
        
        // Reset training state
        state.training.inProgress = false;
        state.training.model = newModel;
        
        // Update UI
        elements.startTrainingBtn.disabled = false;
        elements.resetFormBtn.disabled = false;
        
        logTrainingMessage(`Model saved as '${modelName}'`);
        
        // Show success notification
        showNotification('Success!', `Model trained with ${finalAccuracy} accuracy and saved.`, 'success');
    }

    function logTrainingMessage(message, type = '') {
        if (!elements.trainingLog) return;
        
        const p = document.createElement('p');
        p.textContent = message;
        
        if (type) {
            p.classList.add(type);
        }
        
        elements.trainingLog.appendChild(p);
        
        // Auto-scroll to the bottom
        elements.trainingLog.scrollTop = elements.trainingLog.scrollHeight;
    }

    function refreshData() {
        if (state.dataRefreshing) return;
        
        state.dataRefreshing = true;
        elements.refreshDataBtn.disabled = true;
        elements.refreshDataBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Refreshing...';
        
        // Simulate data refresh
        setTimeout(() => {
            state.dataRefreshing = false;
            elements.refreshDataBtn.disabled = false;
            elements.refreshDataBtn.innerHTML = '<i class="fas fa-sync-alt"></i> <span>Refresh</span>';
            
            // Show success notification
            showNotification('Refreshed!', 'Dataset information is now up-to-date.', 'success');
        }, 1500);
    }

    function checkForSavedModels() {
        // In a real app, we would load from localStorage or an API
        // For demo, we'll add a sample model if we have no models yet
        if (state.models.length === 0) {
            // Add a sample model
            state.models.push({
                id: 1,
                name: 'CIFAR10_CNN_Demo_Model',
                type: 'cnn',
                accuracy: '0.7825',
                date: '2025-05-18',
                size: '2.4 MB',
                description: 'A basic CNN model trained on CIFAR-10 with data augmentation. Used for image classification with 10 categories.'
            });
        }
        
        renderModels();
    }

    function renderModels() {
        if (!elements.modelsContainer) return;
        
        if (state.models.length === 0) {
            // Show empty state
            if (elements.emptyModels) {
                elements.emptyModels.style.display = 'block';
            }
            return;
        }
        
        // Hide empty state
        if (elements.emptyModels) {
            elements.emptyModels.style.display = 'none';
        }
        
        // Clear current models
        elements.modelsContainer.innerHTML = '';
        
        // Add each model
        state.models.forEach(model => {
            const modelCard = document.createElement('div');
            modelCard.className = 'model-card';
            modelCard.dataset.id = model.id;
            
            modelCard.innerHTML = `
                <div class="model-info">
                    <div class="model-name">${model.name}</div>
                    <div class="model-meta">
                        <div class="model-meta-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${model.date}</span>
                        </div>
                        <div class="model-meta-item">
                            <i class="fas fa-chart-line"></i>
                            <span>Accuracy: ${model.accuracy}</span>
                        </div>
                        <div class="model-meta-item">
                            <i class="fas fa-file"></i>
                            <span>${model.size}</span>
                        </div>
                    </div>
                    <div class="model-description">
                        ${model.description}
                    </div>
                </div>
                <div class="model-actions">
                    <button class="btn btn-primary download-model" data-id="${model.id}">
                        <i class="fas fa-download btn-icon"></i>
                        Download
                    </button>
                    <button class="btn btn-outline details-model" data-id="${model.id}">
                        <i class="fas fa-info-circle btn-icon"></i>
                        Details
                    </button>
                </div>
            `;
            
            elements.modelsContainer.appendChild(modelCard);
            
            // Add event listeners to buttons
            modelCard.querySelector('.download-model').addEventListener('click', () => downloadModel(model.id));
            modelCard.querySelector('.details-model').addEventListener('click', () => showModelDetails(model.id));
        });
    }

    function downloadModel(modelId) {
        // In a real app, this would trigger a download
        // For our demo, we'll just show a notification
        showNotification('Download Started', 'The model file will be downloaded shortly.', 'info');
    }

    function showModelDetails(modelId) {
        // Find the model
        const model = state.models.find(m => m.id === modelId);
        
        if (!model) return;
        
        // In a real app, this would show a modal with details
        // For our demo, we'll use a notification
        showNotification(model.name, `Type: ${model.type.toUpperCase()}, Accuracy: ${model.accuracy}, Size: ${model.size}`, 'info');
    }
    
    function showNotification(title, message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">${title}</div>
                <button class="notification-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="notification-body">
                ${message}
            </div>
        `;
        
        // Append to body
        document.body.appendChild(notification);
        
        // Add event listener to close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('notification-show');
        }, 10);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Helper functions
    function getRandomModelSize(modelType) {
        // Return a realistic model size based on architecture
        if (modelType === 'cnn') {
            return '2.4 MB';
        } else if (modelType === 'resnet') {
            return '8.7 MB';
        } else if (modelType === 'mobilenet') {
            return '3.8 MB';
        }
        return '5.0 MB';
    }

    function getModelDescription(modelType) {
        if (modelType === 'cnn') {
            return 'A basic CNN model trained on CIFAR-10 with data augmentation. Used for image classification with 10 categories.';
        } else if (modelType === 'resnet') {
            return 'A ResNet-based model with higher accuracy but larger size. Includes skip connections for better gradient flow.';
        } else if (modelType === 'mobilenet') {
            return 'A lightweight MobileNetV2 model optimized for edge devices. Good balance between size and accuracy.';
        }
        return 'A machine learning model trained on the CIFAR-10 dataset for image classification.';
    }
    
    // Add this to your CSS
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        /* Notification styles */
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            background-color: var(--bg-card);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
            z-index: 9999;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .notification-show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification-hiding {
            transform: translateX(400px);
            opacity: 0;
        }
        
        .notification-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            border-bottom: 1px solid var(--border-primary);
        }
        
        .notification-title {
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 14px;
            transition: color 0.2s;
        }
        
        .notification-close:hover {
            color: var(--text-primary);
        }
        
        .notification-body {
            padding: 15px;
            color: var(--text-secondary);
            font-size: 14px;
        }
        
        .notification-info {
            border-left: 4px solid var(--info);
        }
        
        .notification-success {
            border-left: 4px solid var(--success);
        }
        
        .notification-warning {
            border-left: 4px solid var(--warning);
        }
        
        .notification-error {
            border-left: 4px solid var(--danger);
        }
    `;
    document.head.appendChild(styleEl);
});
