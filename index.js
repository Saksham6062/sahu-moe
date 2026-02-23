/**
 * ============================================
 * SAHUAI AGENT v5.0 - MAIN JAVASCRIPT FILE
 * ============================================
 * 
 * Official Saksham Intelligence AI Models Chat
 * 57+ Models | 15+ Providers | Consensus-Powered
 * 
 * @version 5.0.0
 * @author Saksham Sahu
 * @organization Saksham Intelligence
 * @license MIT
 * 
 * File: index.js
 * Lines: ~6,500
 * 
 * ============================================
 */

// ============================================
// SECTION 1: GLOBAL STATE & CONFIGURATION
// ============================================

/**
 * Global application state
 * All state is persisted to localStorage
 */
const state = {
    // Chat State
    messages: [],
    chatHistory: [],
    currentChatId: null,
    isProcessing: false,
    lastProcessStart: 0,
    
    // File State
    uploadedFile: null,
    uploadedFileContent: null,
    
    // Provider & Model State
    activeProviders: ['nvidia'],
    selectedModels: [],
    customProviders: [],
    
    // Mode State
    mode: 'standard', // standard, task, research, search
    taskType: 'vibe', // vibe, agentic, file_creation
    examMode: false,
    
    // Feature Toggles (All enabled by default for v5.0)
    features: {
        neuralConsensus: true,
        debateMode: true,
        temporalReasoning: true,
        adaptiveReasoning: true,
        uncertaintyBadge: true,
        tokenEstimator: true,
        responseRating: true,
        threeTierMemory: true,
        selfCorrectingCode: true,
        usageAnalytics: true,
        agentSwarm: true,
        rapidLearning: true,
        physicalIntegration: true,
        constitutionalSafety: true
    },
    
    // DeepThink State
    deepThinkEnabled: true,
    thinkingBudget: 'balanced', // fast, balanced, ultra, original
    
    // Pipeline State
    autoFallback: true,
    aggregationStyle: 'synthesis', // synthesis, majority, weighted, critical
    stageSelector: '1', // none, 1, 2, 3
    promptRefinerEnabled: true,
    
    // Safety State
    safetyModels: {
        graniteGuard: true,
        shieldGemma: true,
        llamaGuard: true
    },
    
    // Voice State
    voiceConfig: {
        tts: 'nvidia/magpie-tts-multilingual',
        asr: 'openai/whisper-large-v3'
    },
    
    // Search State
    activeSearchEngines: [],
    customSearchEngines: [],
    lastSources: [],
    searchProvider: 'ddg',
    
    // Research State
    researchConfig: {},
    researchEnabled: false,
    
    // Customization State
    customInstructions: {
        user: '',
        resp: ''
    },
    language: 'en',
    temperature: 0.7,
    maxTokens: 8000,
    
    // Single Model Mode
    singleModelMode: false,
    singleModelId: 'minimaxai/minimax-m2.1',
    
    // Model Response Count (1x, 2x, 3x per model)
    modelResponseCounts: {},
    
    // UI State
    theme: 'light',
    pinnedMessages: [],
    totalTokens: 0,
    currentArtifact: { code: '', type: 'text' },
    
    // Metrics
    metrics: {
        time: 0,
        speed: 0,
        total: 0
    },
    
    // Translation State
    translationEnabled: false,
    translationSource: 'auto',
    translationTarget: 'en'
};

// ============================================
// SECTION 2: PROVIDER & MODEL CONFIGURATIONS
// ============================================

/**
 * Language configurations for UI and responses
 */
const LANGUAGES = [
    {code:'en',name:'English'},{code:'es',name:'Spanish'},{code:'fr',name:'French'},{code:'de',name:'German'},{code:'it',name:'Italian'},{code:'pt',name:'Portuguese'},{code:'zh',name:'Chinese'},{code:'ja',name:'Japanese'},{code:'ko',name:'Korean'},{code:'ru',name:'Russian'},
    {code:'hi',name:'Hindi'},{code:'ar',name:'Arabic'},{code:'bn',name:'Bengali'},{code:'pa',name:'Punjabi'},{code:'jv',name:'Javanese'},{code:'vi',name:'Vietnamese'},{code:'te',name:'Telugu'},{code:'mr',name:'Marathi'},{code:'ta',name:'Tamil'},{code:'ur',name:'Urdu'},
    {code:'tr',name:'Turkish'},{code:'fa',name:'Persian'},{code:'gu',name:'Gujarati'},{code:'pl',name:'Polish'},{code:'uk',name:'Ukrainian'},{code:'ro',name:'Romanian'},{code:'nl',name:'Dutch'},{code:'el',name:'Greek'},{code:'hu',name:'Hungarian'},{code:'sv',name:'Swedish'},
    {code:'cs',name:'Czech'},{code:'th',name:'Thai'},{code:'id',name:'Indonesian'},{code:'ms',name:'Malay'},{code:'da',name:'Danish'},{code:'fi',name:'Finnish'},{code:'no',name:'Norwegian'},{code:'he',name:'Hebrew'},{code:'bg',name:'Bulgarian'},{code:'hr',name:'Croatian'},
    {code:'sr',name:'Serbian'},{code:'sk',name:'Slovak'},{code:'sl',name:'Slovenian'},{code:'et',name:'Estonian'},{code:'lv',name:'Latvian'},{code:'lt',name:'Lithuanian'},{code:'af',name:'Afrikaans'},{code:'sw',name:'Swahili'},{code:'ca',name:'Catalan'},{code:'eu',name:'Basque'},
    {code:'gl',name:'Galician'},{code:'is',name:'Icelandic'},{code:'ga',name:'Irish'},{code:'sq',name:'Albanian'},{code:'mk',name:'Macedonian'},{code:'bs',name:'Bosnian'},{code:'cy',name:'Welsh'},{code:'hy',name:'Armenian'},{code:'ka',name:'Georgian'},{code:'be',name:'Belarusian'},
    {code:'az',name:'Azerbaijani'},{code:'kk',name:'Kazakh'},{code:'ky',name:'Kyrgyz'},{code:'uz',name:'Uzbek'},{code:'tk',name:'Turkmen'},{code:'tg',name:'Tajik'},{code:'mn',name:'Mongolian'},{code:'ne',name:'Nepali'},{code:'si',name:'Sinhala'},{code:'my',name:'Burmese'},
    {code:'km',name:'Khmer'},{code:'lo',name:'Lao'},{code:'am',name:'Amharic'},{code:'so',name:'Somali'},{code:'yo',name:'Yoruba'},{code:'ig',name:'Igbo'},{code:'ha',name:'Hausa'},{code:'zu',name:'Zulu'},{code:'xh',name:'Xhosa'},{code:'st',name:'Sotho'},
    {code:'fil',name:'Filipino'},{code:'mg',name:'Malagasy'},{code:'ny',name:'Chichewa'},{code:'sn',name:'Shona'},{code:'co',name:'Corsican'},{code:'fy',name:'Frisian'},{code:'gd',name:'Scots Gaelic'},{code:'ht',name:'Haitian Creole'},{code:'haw',name:'Hawaiian'},{code:'hmn',name:'Hmong'},
    {code:'jw',name:'Javanese'},{code:'kn',name:'Kannada'},{code:'ku',name:'Kurdish'},{code:'lb',name:'Luxembourgish'},{code:'mi',name:'Maori'},{code:'ml',name:'Malayalam'},{code:'mt',name:'Maltese'},{code:'ps',name:'Pashto'},{code:'sd',name:'Sindhi'},{code:'sm',name:'Samoan'},
    {code:'su',name:'Sundanese'},{code:'yi',name:'Yiddish'}
];

/**
 * UI Translations for supported languages
 */
const UI_TRANSLATIONS = {
    'es': { 'newChat': 'Nuevo Chat', 'settings': 'Ajustes', 'send': 'Enviar', 'config': 'Configurar Modelos', 'docs': 'Documentación', 'install': 'Instalar App' },
    'fr': { 'newChat': 'Nouveau Chat', 'settings': 'Paramètres', 'send': 'Envoyer', 'config': 'Configurer Modèles', 'docs': 'Documentation', 'install': 'Installer App' },
    'de': { 'newChat': 'Neuer Chat', 'settings': 'Einstellungen', 'send': 'Senden', 'config': 'Modelle Konfig.', 'docs': 'Dokumentation', 'install': 'App Installieren' },
    'hi': { 'newChat': 'नई चैट', 'settings': 'सेटिंग्स', 'send': 'भेजें', 'config': 'मॉडल कॉन्फ़िगर करें', 'docs': 'दस्तावेज़ीकरण', 'install': 'ऐप इंस्टॉल करें' },
    'zh': { 'newChat': '新聊天', 'settings': '设置', 'send': '发送', 'config': '配置模型', 'docs': '文档', 'install': '安装应用' },
    'ja': { 'newChat': '新しいチャット', 'settings': '設定', 'send': '送信', 'config': 'モデル設定', 'docs': 'ドキュメント', 'install': 'アプリをインストール' },
    'ru': { 'newChat': 'Новый чат', 'settings': 'Настройки', 'send': 'Отправить', 'config': 'Конфигурация', 'docs': 'Документация', 'install': 'Установить' },
    'ar': { 'newChat': 'محادثة جديدة', 'settings': 'إعدادات', 'send': 'إرسال', 'config': 'تكوين النماذج', 'docs': 'التوثيق', 'install': 'تثبيت التطبيق' },
    'pt': { 'newChat': 'Novo Chat', 'settings': 'Configurações', 'send': 'Enviar', 'config': 'Configurar Modelos', 'docs': 'Documentação', 'install': 'Instalar App' }
};

/**
 * Model-specific configurations
 */
const MODEL_CONFIGS = {
    'sarvamai/sarvam-m': { max_tokens: 30000 },
    'qwen/qwq-32b': { max_tokens: 30000 },
    'qwen/qwen2.5-7b-instruct': { max_tokens: 30000 },
    'mistralai/mamba-codestral-7b-v0.1': { max_tokens: 30000 },
    'google/gemma-3-1b-it': { max_tokens: 30000 },
    'google/gemma-3n-e4b-it': { max_tokens: 30000 },
    'microsoft/phi-4-mini-flash-reasoning': { max_tokens: 60000 },
    'mistralai/mixtral-8x22b-instruct-v0.1': { max_tokens: 60000 },
    'google/shieldgemma-9b': { max_tokens: 1000 },
    'google/gemma-7b': { max_tokens: 6000, noSystemRole: true },
    'google/gemma-2-27b-it': { max_tokens: 6000, noSystemRole: true },
    'thudm/chatglm3-6b': { max_tokens: 6000 },
    'nvidia/nemotron-4-mini-hindi-4b-instruct': { max_tokens: 3000 },
    'microsoft/phi-3-medium-4k-instruct': { max_tokens: 3000 },
    'deepseek-ai/deepseek-r1-distill-qwen-32b': { noStream: true, max_tokens: 30000 },
    'deepseek-ai/deepseek-r1-distill-llama-8b': { noStream: true, max_tokens: 30000 },
    'ibm/granite-3.3-8b-instruct': { noStream: true, max_tokens: 30000 },
    'ibm/granite-guardian-3.0-8b': { noStream: true, max_tokens: 30000 },
    'meta/llama-guard-4-12b': { noStream: true, max_tokens: 30000 },
    'z-ai/glm4.7': { noStream: true, max_tokens: 30000 },
    'nvidia/cosmos-reason2-8b': { max_tokens: 4000 },
    'stockmark/stockmark-2-100b-instruct': { max_tokens: 30000 },
    'minimaxai/minimax-m2.1': { max_tokens: 30000 },
    'minimaxai/minimax-m2.5': { max_tokens: 30000 },
    'moonshotai/kimi-k2.5': { max_tokens: 30000 },
    'moonshotai/kimi-k2-thinking': { max_tokens: 30000 }
};

/**
 * Translation model mapping by language
 */
const TRANSLATION_MODELS = {
    // Indian languages - Sarvam
    'hi': 'sarvamai/sarvam-m', 'bn': 'sarvamai/sarvam-m', 'te': 'sarvamai/sarvam-m', 'ta': 'sarvamai/sarvam-m',
    'mr': 'sarvamai/sarvam-m', 'gu': 'sarvamai/sarvam-m', 'kn': 'sarvamai/sarvam-m', 'ml': 'sarvamai/sarvam-m',
    'pa': 'sarvamai/sarvam-m', 'or': 'sarvamai/sarvam-m', 'as': 'sarvamai/sarvam-m',
    // European languages - Mistral
    'en': 'mistralai/mistral-large', 'fr': 'mistralai/mistral-large', 'de': 'mistralai/mistral-large',
    'es': 'mistralai/mistral-large', 'it': 'mistralai/mistral-large', 'pt': 'mistralai/mistral-large',
    'nl': 'mistralai/mistral-large', 'sv': 'mistralai/mistral-large', 'da': 'mistralai/mistral-large',
    'no': 'mistralai/mistral-large', 'fi': 'mistralai/mistral-large', 'pl': 'mistralai/mistral-large',
    'cs': 'mistralai/mistral-large', 'sk': 'mistralai/mistral-large', 'hu': 'mistralai/mistral-large',
    'ro': 'mistralai/mistral-large', 'bg': 'mistralai/mistral-large', 'hr': 'mistralai/mistral-large',
    'sl': 'mistralai/mistral-large', 'et': 'mistralai/mistral-large', 'lv': 'mistralai/mistral-large',
    'lt': 'mistralai/mistral-large', 'el': 'mistralai/mistral-large',
    // Portuguese - Granite
    'pt-BR': 'ibm/granite-3.3-8b-instruct', 'pt-PT': 'ibm/granite-3.3-8b-instruct',
    // Japanese - Stockmark
    'ja': 'stockmark/stockmark-2-100b-instruct',
    // Chinese & Korean - Qwen
    'zh': 'qwen/qwen3-235b-a22b', 'zh-CN': 'qwen/qwen3-235b-a22b', 'zh-TW': 'qwen/qwen3-235b-a22b',
    'ko': 'qwen/qwen3-235b-a22b',
    // Russian - MiniMax
    'ru': 'minimaxai/minimax-m2.5',
    // All other languages - Gemma
    'default': 'google/gemma-3-27b-it'
};

/**
 * Complete provider configurations with all 15+ providers
 */
const PROVIDERS = {
    nvidia: {
        name: 'Saksham Intelligence',
        endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
        keyName: 'sahu_nvidia_key',
        color: 'nvidia',
        icon: '🟢',
        models: {
            'Qwen 3.5 397B': 'qwen/qwen3.5-397b',
            'Phi 3.5 Vision': 'microsoft/phi-3.5-vision-instruct',
            'Stockmark 2 100B': 'stockmark/stockmark-2-100b-instruct',
            'Cosmos Reason 2 8B': 'nvidia/cosmos-reason2-8b',
            'Llama 3.2 90B Vision': 'meta/llama-3.2-90b-vision-instruct',
            'GLM 5': 'z-ai/glm5',
            'MiniMax M2.5': 'minimaxai/minimax-m2.5',
            'MiniMax M2.1': 'minimaxai/minimax-m2.1',
            'MiniMax M2': 'minimaxai/minimax-m2',
            'GLM 4.7': 'z-ai/glm4.7',
            'Jamba 1.5 Mini': 'ai21labs/jamba-1.5-mini-instruct',
            'Seed OSS 36B': 'bytedance/seed-oss-36b-instruct',
            'DeepSeek V3.2': 'deepseek-ai/deepseek-v3.2',
            'DeepSeek V3.1': 'deepseek-ai/deepseek-v3.1',
            'DeepSeek V3.1 Terminus': 'deepseek-ai/deepseek-v3.1-terminus',
            'DeepSeek R1 Distill Qwen 32B': 'deepseek-ai/deepseek-r1-distill-qwen-32b',
            'DeepSeek R1 Distill Llama 8B': 'deepseek-ai/deepseek-r1-distill-llama-8b',
            'Gemma 3N E4B': 'google/gemma-3n-e4b-it',
            'Gemma 3 27B': 'google/gemma-3-27b-it',
            'Gemma 3 1B': 'google/gemma-3-1b-it',
            'Gemma 2 27B': 'google/gemma-2-27b-it',
            'Gemma 7B': 'google/gemma-7b',
            'Granite 3.3 8B': 'ibm/granite-3.3-8b-instruct',
            'Granite Guardian': 'ibm/granite-guardian-3.0-8b',
            'Phi 4 Multimodal': 'microsoft/phi-4-multimodal-instruct',
            'Phi 4 Mini Reasoning': 'microsoft/phi-4-mini-flash-reasoning',
            'Phi 3 Medium': 'microsoft/phi-3-medium-4k-instruct',
            'Llama 4 Maverick': 'meta/llama-4-maverick-17b-128e-instruct',
            'Llama 4 Scout': 'meta/llama-4-scout-17b-16e-instruct',
            'Llama 3.3 70B': 'meta/llama-3.3-70b-instruct',
            'Llama 3.2 3B': 'meta/llama-3.2-3b-instruct',
            'Llama Guard 4': 'meta/llama-guard-4-12b',
            'Kimi K2.5': 'moonshotai/kimi-k2.5',
            'Kimi K2 Thinking': 'moonshotai/kimi-k2-thinking',
            'Kimi K2 Instruct': 'moonshotai/kimi-k2-instruct',
            'Devstral 2 123B': 'mistralai/devstral-2-123b-instruct-2512',
            'Mistral Large 3 675B': 'mistralai/mistral-large-3-675b-instruct-2512',
            'Ministral 14B': 'mistralai/ministral-14b-instruct-2512',
            'Magistral Small': 'mistralai/magistral-small-2506',
            'Mixtral 8x22B': 'mistralai/mixtral-8x22b-instruct-v0.1',
            'Mamba Codestral 7B': 'mistralai/mamba-codestral-7b-v0.1',
            'Step 3.5 Flash': 'stepfun-ai/step-3.5-flash',
            'GPT OSS 120B': 'openai/gpt-oss-120b',
            'GPT OSS 20B': 'openai/gpt-oss-20b',
            'Sarvam M': 'sarvamai/sarvam-m',
            'Qwen3 Next 80B': 'qwen/qwen3-next-80b-a3b-instruct',
            'Qwen3 Next 80B Thinking': 'qwen/qwen3-next-80b-a3b-thinking',
            'Qwen3 Coder 480B': 'qwen/qwen3-coder-480b-a35b-instruct',
            'Qwen3 235B': 'qwen/qwen3-235b-a22b',
            'QwQ 32B': 'qwen/qwq-32b',
            'Qwen 2.5 7B': 'qwen/qwen2.5-7b-instruct',
            'Nemotron 4 Mini Hindi': 'nvidia/nemotron-4-mini-hindi-4b-instruct',
            'Nemotron 30B': 'nvidia/nemotron-3-nano-30b-a3b',
            'Nemotron 12B VL': 'nvidia/nemotron-nano-12b-v2-vl',
            'Nemotron 9B': 'nvidia/nvidia-nemotron-nano-9b-v2',
            'Llama 3.3 Nemotron Super 49B': 'nvidia/llama-3.3-nemotron-super-49b-v1.5',
            'ChatGLM3 6B': 'thudm/chatglm3-6b',
            'USDCode Llama 3.1 70B': 'nvidia/usdcode-llama-3.1-70b-instruct',
            'PaliGemma (Vision)': 'google/paligemma',
            'PaddleOCR (Vision)': 'baidu/paddleocr'
        }
    },
    sambanova: {
        name: 'SambaNova',
        endpoint: 'https://api.sambanova.ai/v1/chat/completions',
        keyName: 'sahu_sambanova_key',
        color: 'sambanova',
        icon: '🌊',
        models: {
            'ALLaM 7B': 'ALLaM-7B-Instruct-preview',
            'DeepSeek R1': 'DeepSeek-R1-0528',
            'DeepSeek R1 Distill 70B': 'DeepSeek-R1-Distill-Llama-70B',
            'DeepSeek V3.1': 'DeepSeek-V3.1',
            'DeepSeek V3.1 Terminus': 'DeepSeek-V3.1-Terminus',
            'DeepSeek V3.2': 'DeepSeek-V3.2',
            'Llama Swallow 70B': 'Llama-3.3-Swallow-70B-Instruct-v0.4',
            'Llama 4 Maverick': 'Llama-4-Maverick-17B-128E-Instruct',
            'Llama 3.1 8B': 'Meta-Llama-3.1-8B-Instruct',
            'Llama 3.3 70B': 'Meta-Llama-3.3-70B-Instruct',
            'GPT OSS 120B': 'gpt-oss-120b',
            'Qwen3 235B': 'Qwen3-235B',
            'Qwen3 32B': 'Qwen3-32B'
        }
    },
    huggingface: {
        name: 'HuggingFace',
        endpoint: 'https://router.huggingface.co/v1/chat/completions',
        keyName: 'sahu_huggingface_key',
        color: 'huggingface',
        icon: '🤗',
        models: {
            'DeepSeek OCR': 'deepseek-ai/deepseek-ocr',
            'DeepSeek OCR 2': 'deepseek-ai/deepseek-ocr-2',
            'GLM 5': 'zai-org/GLM-5',
            'MiniMax M2.5': 'minimaxai/MiniMax-M2.5',
            'GLM 5 Flash': 'zai-org/GLM-5-Flash',
            'GLM 4.7': 'zai-org/GLM-4.7',
            'GLM 4.7 Flash': 'zai-org/GLM-4.7-Flash',
            'ERNIE 4.5 VL': 'baidu/ERNIE-4.5-VL-424B-A47B-Base-PT',
            'DeepSeek V3.2': 'deepseek-ai/DeepSeek-V3.2',
            'DeepSeek R1': 'deepseek-ai/DeepSeek-R1',
            'DeepSeek R1 Distill': 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B',
            'Qwen3 Coder': 'Qwen/Qwen3-Coder-480B-A35B-Instruct',
            'Qwen3 Thinking': 'Qwen/Qwen3-235B-A22B-Thinking-2507',
            'Mistral 7B': 'mistralai/Mistral-7B-Instruct-v0.3',
            'Kimi K2 Thinking': 'moonshotai/Kimi-K2-Thinking',
            'Kimi K2': 'moonshotai/Kimi-K2-Instruct',
            'Kimi K2.5': 'moonshotai/Kimi-K2.5',
            'GPT OSS 120B': 'openai/gpt-oss-120b',
            'GPT OSS 20B': 'openai/gpt-oss-20b',
            'MiMo V2 Flash': 'XiaomiMiMo/MiMo-V2-Flash',
            'MiniMax M2.1': 'MiniMaxAI/MiniMax-M2.1',
            'Olmo 3.1': 'allenai/Olmo-3.1-32B-Instruct',
            'Olmo 3.1 Think': 'allenai/Olmo-3.1-32B-Think',
            'Llama 3.3 70B': 'meta-llama/Llama-3.3-70B-Instruct',
            'NextCoder 32B': 'microsoft/NextCoder-32B',
            'KAT Dev': 'Kwaipilot/KAT-Dev'
        }
    },
    openrouter: {
        name: 'OpenRouter',
        endpoint: 'https://openrouter.ai/api/v1/chat/completions',
        keyName: 'sahu_openrouter_key',
        color: 'openrouter',
        icon: '🔀',
        models: {
            'Trinity Large': 'arcee-ai/trinity-large-preview:free',
            'Solar Pro 3': 'upstage/solar-pro-3:free',
            'LFM Thinking': 'liquid/lfm-2.5-1.2b-thinking:free',
            'LFM Instruct': 'liquid/lfm-2.5-1.2b-instruct:free',
            'Molmo 2 8B': 'allenai/molmo-2-8b:free',
            'Nemotron 30B': 'nvidia/nemotron-3-nano-30b-a3b:free',
            'Trinity Mini': 'arcee-ai/trinity-mini:free',
            'TNG R1T Chimera': 'tngtech/tng-r1t-chimera:free',
            'Nemotron 12B VL': 'nvidia/nemotron-nano-12b-v2-vl:free',
            'Qwen3 Next 80B': 'qwen/qwen3-next-80b-a3b-instruct:free',
            'Nemotron 9B': 'nvidia/nemotron-nano-9b-v2:free',
            'GLM 4.5 Air': 'z-ai/glm-4.5-air:free',
            'Qwen3 Coder': 'qwen/qwen3-coder:free',
            'DeepSeek R1T2 Chimera': 'tngtech/deepseek-r1t2-chimera:free',
            'DeepSeek R1': 'deepseek/deepseek-r1-0528:free',
            'Qwen3 4B': 'qwen/qwen3-4b:free',
            'DeepSeek R1T Chimera': 'tngtech/deepseek-r1t-chimera:free',
            'Mistral Small': 'mistralai/mistral-small-3.1-24b-instruct:free',
            'Qwen 2.5 VL': 'qwen/qwen-2.5-vl-7b-instruct:free',
            'Hermes 3 405B': 'nousresearch/hermes-3-llama-3.1-405b:free',
            'Llama 3.1 405B': 'meta-llama/llama-3.1-405b-instruct:free',
            'Nova 2 Lite': 'amazon/nova-2-lite-v1'
        }
    },
    groq: {
        name: 'Groq',
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        keyName: 'sahu_groq_key',
        color: 'groq',
        icon: '⚡',
        models: {
            'GPT OSS 120B': 'openai/gpt-oss-120b',
            'GPT OSS 20B': 'openai/gpt-oss-20b',
            'Qwen3 32B': 'qwen/qwen3-32b',
            'Llama 3.1 8B': 'llama-3.1-8b-instant',
            'Llama 3.3 70B': 'llama-3.3-70b-versatile',
            'Llama 4 Maverick': 'meta-llama/llama-4-maverick-17b-128e-instruct',
            'Llama 4 Scout': 'meta-llama/llama-4-scout-17b-16e-instruct',
            'Kimi K2 Instruct': 'moonshotai/kimi-k2-instruct',
            'Kimi K2 0905': 'moonshotai/kimi-k2-instruct-0905',
            'Groq Compound': 'groq/compound'
        }
    },
    together: {
        name: 'Together AI',
        endpoint: 'https://api.together.xyz/v1/chat/completions',
        keyName: 'sahu_together_key',
        color: 'together',
        icon: '🤝',
        models: {
            'GLM 5': 'z-ai/glm-5',
            'MiniMax M2.5': 'minimaxai/MiniMax-M2.5',
            'GLM 4.7': 'zai-org/GLM-4.7',
            'Llama 4 Maverick': 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8',
            'DeepSeek R1': 'deepseek-ai/DeepSeek-R1-0528-tput',
            'Ministral 14B': 'mistralai/Ministral-3-14B-Instruct-2512',
            'Trinity Mini': 'arcee-ai/trinity-mini',
            'Cogito 671B': 'deepcogito/cogito-v2-1-671b',
            'GLM 4.5 Air': 'zai-org/GLM-4.5-Air-FP8',
            'Qwen3 Next 80B': 'Qwen/Qwen3-Next-80B-A3B-Thinking',
            'Gemma 3N': 'google/gemma-3n-E4B-it',
            'Nemotron 9B': 'nvidia/NVIDIA-Nemotron-Nano-9B-v2',
            'Llama 4 Scout': 'meta-llama/Llama-4-Scout-17B-16E-Instruct',
            'Cogito 405B': 'deepcogito/cogito-v2-preview-llama-405B',
            'Cogito 109B': 'deepcogito/cogito-v2-preview-llama-109B-MoE'
        }
    },
    cerebras: {
        name: 'Cerebras',
        endpoint: 'https://api.cerebras.ai/v1/chat/completions',
        keyName: 'sahu_cerebras_key',
        color: 'cerebras',
        icon: '🧠',
        models: {
            'Qwen 3 32B': 'qwen-3-32b',
            'Qwen 3 235B': 'qwen-3-235b-a22b-instruct-2507',
            'GPT OSS 120B': 'gpt-oss-120b',
            'Llama 3.3 70B': 'llama-3.3-70b',
            'Llama 3.1 8B': 'llama3.1-8b',
            'ZAI GLM 4.7': 'zai-glm-4.7'
        }
    },
    fireworks: {
        name: 'Fireworks AI',
        endpoint: 'https://api.fireworks.ai/inference/v1/chat/completions',
        keyName: 'sahu_fireworks_key',
        color: 'fireworks',
        icon: '🎆',
        models: {
            'GLM 5': 'accounts/fireworks/models/glm-5',
            'MiniMax M2.5': 'accounts/fireworks/models/minimax-m2.5',
            'DeepSeek OCR': 'accounts/fireworks/models/deepseek-ocr',
            'DeepSeek OCR 2': 'accounts/fireworks/models/deepseek-ocr-2',
            'Kimi K2.5': 'accounts/fireworks/models/kimi-k2p5',
            'MiniMax M2.1': 'accounts/fireworks/models/minimax-m2p1',
            'GLM 4.7': 'accounts/fireworks/models/glm-4p7',
            'DeepSeek V3.2': 'accounts/fireworks/models/deepseek-v3p2',
            'Qwen3 VL 235B': 'accounts/fireworks/models/qwen3-vl-235b-a22b-thinking',
            'DeepSeek R1': 'accounts/fireworks/models/deepseek-r1-0528',
            'Qwen3 235B': 'accounts/fireworks/models/qwen3-235b-a22b-thinking-2507',
            'DeepSeek V3.1': 'accounts/fireworks/models/deepseek-v3p1',
            'GLM 4.6': 'accounts/fireworks/models/glm-4p6',
            'MiniMax M2': 'accounts/fireworks/models/minimax-m2',
            'Qwen3 Coder 480B': 'accounts/fireworks/models/qwen3-coder-480b-a35b-instruct'
        }
    },
    routeway: {
        name: 'Routeway',
        endpoint: 'https://api.routeway.ai/v1/chat/completions',
        keyName: 'sahu_routeway_key',
        color: 'routeway',
        icon: '🛤️',
        models: {
            'Opus 4.5': 'claude-opus-4.5',
            'Sonnet 4.5': 'claude-sonnet-4.5',
            'Haiku 4.5': 'claude-haiku-4.5',
            'o3 Mini High': 'o3-mini-high',
            'Command R+': 'command-r-plus-08-2024',
            'Command A Reasoning': 'command-a-reasoning-08-2025',
            'Command A': 'command-a-03-2025',
            'TNG R1T Chimera': 'tngtech/tng-r1t-chimera:free',
            'Nemotron 30B': 'nemotron-3-nano-30b-a3b:free',
            'Devstral': 'devstral-2512:free',
            'Kimi K2 0905': 'kimi-k2-0905:free',
            'MiniMax M2': 'minimax-m2:free',
            'Nemotron 9B': 'nemotron-nano-9b-v2:free',
            'DeepSeek R1T2 Chimera': 'deepseek-r1t2-chimera:free',
            'DeepSeek R1T Chimera': 'deepseek-r1t-chimera:free',
            'GPT OSS 120B': 'gpt-oss-120b:free',
            'GLM 4.5 Air': 'glm-4.5-air:free',
            'DeepSeek R1': 'deepseek-r1-0528:free',
            'Mistral Nemo': 'mistral-nemo-instruct:free',
            'DeepSeek R1 (Free)': 'deepseek-r1:free',
            'DeepSeek R1 Distill 32B': 'deepseek-r1-distill-qwen-32b:free',
            'Llama 3.2 3B': 'llama-3.2-3b-instruct:free',
            'Llama 3.3 70B': 'llama-3.3-70b-instruct:free',
            'Llama 3.1 8B': 'llama-3.1-8b-instruct:free',
            'Llama 3.2 1B': 'llama-3.2-1b-instruct:free',
            'Claude Opus 4.6': 'claude-opus-4-6',
            'Claude Opus 4.6 Free': 'claude-opus-4-6:free'
        }
    },
    mistral: {
        name: 'Mistral',
        endpoint: 'https://api.mistral.ai/v1/agents/completions',
        keyName: 'sahu_mistral_key',
        color: 'mistral',
        icon: '🌀',
        models: {
            'Magistral Medium': 'ag_019bd61a73807623a04e608019bbd02f',
            'Ministral 14B': 'ag_019bd61e5c1c751993fd59206f87615c',
            'Mistral Large': 'ag_019bd5e9195c72c591ae1de889616331',
            'Codestral': 'ag_019bd615fbb872f5a2f5dcaaa3de7c80',
            'Devstral': 'ag_019bd5f9714b7062b5ee3544b9fd095e'
        }
    },
    gemini: {
        name: 'Gemini',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
        keyName: 'sahu_gemini_key',
        color: 'gemini',
        icon: '✨',
        models: {
            'Gemini 3 Flash': 'gemini-3-flash-preview',
            'Gemini 2.5 Pro': 'gemini-2.5-pro',
            'Gemini 2.5 Flash': 'gemini-flash-latest',
            'Gemini 2.5 Flash Lite': 'gemini-flash-lite-latest'
        }
    },
    longcat: {
        name: 'LongCat',
        endpoint: 'https://api.longcat.chat/openai/v1/chat/completions',
        keyName: 'sahu_longcat_key',
        color: 'longcat',
        icon: '🐱',
        models: {
            'LongCat Flash Chat': 'LongCat-Flash-Chat',
            'LongCat Flash Thinking': 'LongCat-Flash-Thinking',
            'LongCat Flash Thinking 2601': 'LongCat-Flash-Thinking-2601',
            'LongCat Flash Lite': 'LongCat-Flash-Lite'
        }
    },
    ollama: {
        name: 'Ollama Cloud',
        endpoint: 'https://api.ollama.cloud/v1/chat/completions',
        keyName: 'sahu_ollama_key',
        color: 'ollama',
        icon: '🦙',
        models: {
            'Qwen3 Coder Next': 'qwen3-coder-next:cloud',
            'Qwen3 VL': 'qwen3-vl:cloud',
            'Qwen3 Next 80B': 'qwen3-next:80b-cloud',
            'Kimi K2.5': 'kimi-k2.5:cloud',
            'Kimi K2 Thinking': 'kimi-k2-thinking:cloud',
            'Kimi K2 1T': 'kimi-k2:1t-cloud',
            'MiniMax M2.1': 'minimax-m2.1:cloud',
            'MiniMax M2': 'minimax-m2:cloud',
            'DeepSeek V3.2': 'deepseek-v3.2:cloud',
            'DeepSeek V3.1 671B': 'deepseek-v3.1:671b-cloud',
            'GLM 4.6': 'glm-4.6:cloud',
            'GLM 4.7': 'glm-4.7:cloud',
            'Ministral 3 14B': 'ministral-3:14b-cloud',
            'Ministral 3 8B': 'ministral-3:8b-cloud',
            'Devstral Small 2 24B': 'devstral-small-2::24b-cloud',
            'Devstral 2 123B': 'devstral-2:123b-cloud',
            'Nemotron 3 Nano 30B': 'nemotron-3-nano:30b-cloud',
            'Cogito 2.1 671B': 'cogito-2.1:671b-cloud',
            'RNJ 1 8B': 'rnj-1:8b-cloud',
            'Gemini 3 Pro': 'gemini-3-pro-preview',
            'Gemini 3 Flash': 'gemini-3-flash-preview',
            'GPT OSS 120B': 'gpt-oss:120b-cloud',
            'Gemma 3 27B': 'gemma3:27b-cloud'
        }
    },
    zenmusk: {
        name: 'ZenMusk',
        endpoint: 'https://zenmux.ai/api/v1/chat/completions',
        keyName: 'sahu_zenmusk_key',
        color: 'zenmusk',
        icon: '🚀',
        models: {
            'GLM 5': 'z-ai/glm-5',
            'GLM 5 Flash': 'z-ai/glm-5-flash',
            'Claude Opus 4.6': 'anthropic/claude-opus-4.6',
            'Step 3.5 Flash': 'stepfun/step-3.5-flash-free',
            'MiniMax M2 Her': 'minimax/minimax-m2-her',
            'Qwen3 Max': 'qwen/qwen3-max',
            'Ernie 5.0 Thinking': 'baidu/ernie-5.0-thinking-preview',
            'GLM 4.7 Flash': 'z-ai/glm-4.7-flash-free',
            'MiMo V2 Flash': 'xiaomi/mimo-v2-flash-free',
            'GPT 5.2 Pro': 'openai/gpt-5.2-pro',
            'GPT 5.2': 'openai/gpt-5.2',
            'GLM 4.6v Flash': 'z-ai/glm-4.6v-flash-free',
            'Claude Opus 4.5': 'anthropic/claude-opus-4.5',
            'Gemini 3 Pro': 'google/gemini-3-pro-preview',
            'KAT Coder Pro': 'kuaishou/kat-coder-pro-v1-free',
            'Grok Code Fast': 'x-ai/grok-code-fast-1'
        }
    },
    ionet: {
        name: 'io.net',
        endpoint: 'https://api.io.net/v1/chat/completions',
        keyName: 'sahu_ionet_key',
        color: 'ionet',
        icon: '☁️',
        models: {
            'Kimi K2 Thinking': 'Kimi-K2-Thinking',
            'Kimi K2 Instruct 0905': 'Kimi-K2-Instruct-0905',
            'GLM 4.7 Flash': 'GLM-4.7-Flash',
            'GLM 4.7': 'GLM-4.7',
            'DeepSeek V3.2': 'DeepSeek-V3.2',
            'GPT OSS 120B': 'gpt-oss-120b',
            'GPT OSS 20B': 'gpt-oss-20b',
            'GLM 4.6': 'GLM-4.6',
            'Qwen3 Next 80B': 'Qwen3-Next-80B-A3B-Instruct',
            'Qwen3 Coder 480B': 'Qwen3-Coder-480B-A35B-Instruct-int4-mixed-ar',
            'Llama 4 Maverick': 'Llama-4-Maverick-17B-128E-Instruct-FP8',
            'Llama 3.3 70B': 'Llama-3.3-70B-Instruct',
            'Mistral Nemo': 'Mistral-Nemo-Instruct-2407',
            'Mistral Large': 'Mistral-Large-Instruct-2411'
        }
    }
};

/**
 * Aggregator prompts for multi-stage synthesis
 */
const AGGREGATOR_PROMPTS = {
    stage1: `You are Stage 1 Aggregator. Analyze all expert answers, identify consensus, disagreements, and errors. Create an initial synthesis. Think step by step in <think>tags.`,
    stage2: `You are Stage 2 Aggregator. Verify the Stage 1 synthesis, resolve contradictions, fill gaps. Think deeply in <think>tags.`,
    stage3: `You are Stage 3 Final Aggregator. Produce a clean, polished final answer. No meta-commentary. Complete and authoritative. Think briefly in <think>tags. Use tools if necessary: SEARCH: <query> or CALC: <expr> or CODE: <python>. Cite sources as [1], [2] if provided.`
};

/**
 * Search engine configurations
 */
const SEARCH_ENGINES_CONFIG = {
    wikipedia: { name: 'Wikipedia', type: 'api', endpoint: 'https://en.wikipedia.org/w/api.php' },
    reddit: { name: 'Reddit', type: 'api', endpoint: 'https://www.reddit.com/search.json' },
    google: { name: 'Google', type: 'searx', bang: '!g' },
    bing: { name: 'Bing', type: 'searx', bang: '!bing' },
    duckduckgo: { name: 'DuckDuckGo', type: 'searx', bang: '!ddg' },
    yahoo: { name: 'Yahoo', type: 'searx', bang: '!yahoo' },
    yandex: { name: 'Yandex', type: 'searx', bang: '!yandex' },
    qwant: { name: 'Qwant', type: 'searx', bang: '!qwant' },
    brave: { name: 'Brave', type: 'searx', bang: '!brave' },
    startpage: { name: 'Startpage', type: 'searx', bang: '!startpage' },
    baidu: { name: 'Baidu (English)', type: 'searx', bang: '!baidu' },
    youtube: { name: 'YouTube', type: 'searx', bang: '!yt' },
    twitter: { name: 'X (Twitter)', type: 'searx', bang: '!twitter' },
    ncert: { name: 'NCERT', type: 'searx', site: 'ncert.nic.in' },
    diksha: { name: 'DIKSHA', type: 'searx', site: 'diksha.gov.in' },
    cbse: { name: 'CBSE Academic', type: 'searx', site: 'cbseacademic.nic.in' },
    epathshala: { name: 'ePathshala', type: 'searx', site: 'epathshala.nic.in' },
    vedantu: { name: 'Vedantu', type: 'searx', site: 'vedantu.com' },
    magnetbrains: { name: 'Magnet Brains', type: 'searx', site: 'magnetbrains.com' },
    byjus: { name: 'Byjus', type: 'searx', site: 'byjus.com' },
    unacademy: { name: 'Unacademy', type: 'searx', site: 'unacademy.com' },
    mpboard: { name: 'MP Board Solutions', type: 'searx', site: 'mpboardsolutions.in' },
    sahuacademy: { name: 'Sahu Academy', type: 'searx', site: 'saksham6062.github.io/sahu-10' },
    copilot: { name: 'Microsoft Copilot', type: 'searx', site: 'microsoft.com' },
    chatgpt: { name: 'ChatGPT', type: 'searx', site: 'openai.com' },
    chatglm: { name: 'ChatGLM', type: 'searx', site: 'chatglm.cn' },
    gemini: { name: 'Gemini', type: 'searx', site: 'gemini.google.com' },
    deepseek: { name: 'DeepSeek', type: 'searx', site: 'deepseek.com' },
    qwen: { name: 'Qwen', type: 'searx', site: 'aliyun.com' },
    kimi: { name: 'Kimi', type: 'searx', site: 'moonshot.cn' },
    mistral: { name: 'Mistral', type: 'searx', site: 'mistral.ai' },
    grok: { name: 'Grok', type: 'searx', site: 'x.ai' },
    minimax: { name: 'MiniMax', type: 'searx', site: 'minimaxi.com' },
    ernie: { name: 'ERNIE', type: 'searx', site: 'baidu.com' },
    perplexity: { name: 'Perplexity', type: 'searx', site: 'perplexity.ai' },
    discord: { name: 'Discord', type: 'searx', site: 'discord.com' },
    claude: { name: 'Claude', type: 'searx', site: 'anthropic.com' },
    facebook: { name: 'Facebook', type: 'searx', site: 'facebook.com' },
    instagram: { name: 'Instagram', type: 'searx', site: 'instagram.com' },
    github: { name: 'GitHub', type: 'searx', site: 'github.com' },
    googlenews: { name: 'Google News', type: 'searx', bang: '!news' },
    linkedin: { name: 'LinkedIn', type: 'searx', site: 'linkedin.com' },
    grokipedia: { name: 'Grokipedia', type: 'searx', bang: '!w' }
};

/**
 * Thinking budget templates for DeepThink mode
 */
const THINKING_TEMPLATES = {
    fast: `FAST:\n- Minimal decomposition\n- Single reasoning path\n- Direct answer`,
    balanced: `BALANCED:\n- Multi-path reasoning\n- One critique pass\n- Structured explanation`,
    ultra: `ULTRA:\n- Multiple solution paths\n- Deep counter-analysis\n- Full assumption testing\n- Edge-case reasoning\n- Logical robustness check\n- Include Confidence Score (0–100%)`,
    original: `ORIGINAL:\n- Use model's native reasoning\n- No additional processing`
};

/**
 * Research stage configurations
 */
const RESEARCH_STAGES = [
    { id: 'stage1', name: 'Stage 1: Problem Decomposition', experts: ['Strategic Planner', 'Assumption Detector', 'Multimodal Context', 'Sub-question Generator', 'Risk Identification', 'Pros Specialist'] },
    { id: 'stage2', name: 'Stage 2: Multi-Perspective Analysis', experts: ['Analytical', 'Creative', 'Skeptical', 'Data-logic', 'Cross-domain', 'Cons Specialist'] },
    { id: 'stage3', name: 'Stage 3: Stress Testing', experts: ['Logical Flaw', 'Counter Argument', 'Edge Case', 'Failure Mode', 'Consistency', 'Neutral Analyst'] },
    { id: 'stage4', name: 'Stage 4: Synthesis', experts: ['Deep Synthesizer', 'Structural Optimizer', 'Depth Preserver', 'Readability', 'Insight Extractor'] },
    { id: 'stage5', name: 'Stage 5: Final Aggregator', experts: ['Final Aggregator'] }
];

/**
 * Identity response patterns (triggers predefined response)
 */
const IDENTITY_PATTERNS = [
    /\b(who\s*(are|r)\s*(you|u)|what\s*(model|ai)\s*(are|r)\s*(you|u)|tell\s*me\s*about\s*(yourself|you)|what\s*is\s*sahuai|sahu\s*ai|who\s*(built|made|created)\s*(you|sahuai)|your\s*identity)\b/i,
    /\b(your\s*name|what\s*are\s*you|which\s*model|introduce\s*yourself)\b/i
];

/**
 * Exact identity response text
 */
const IDENTITY_RESPONSE = `I'm SahuAI Agent, an AI assistant built by Saksham intelligence to help you explore ideas, answer questions, and tackle tasks with clear, reliable info.

At my core, I draw from a vast knowledge base up to January 2025, powered by advanced Open Source models like MiniMax m2.1 & GLM 5 & Kimi K2.5 Qwen 3.5, to deliver expert-level responses. Think of me as your go-to research buddy—fast, accurate, and always citing sources when it matters. I shine in explaining complex topics simply (like quantum physics via everyday analogies), brainstorming creative projects, summarizing articles, writing or rewriting content, and casual chats.

Unlike generic chatbots, I prioritize truthfulness: I reason step-by-step, avoid fluff, and flag uncertainties. No hallucinations here—I stick to facts or say when I don't know. My style? Friendly, concise, and structured for easy reading, with lists, examples, and visuals when they help.

Fun fact: I'm designed for curiosity-driven users, whether you're in Bhopal puzzling over local history or globally brainstorming a startup. Got a specific question or task? Fire away!`;

// ============================================
// SECTION 3: GLOBAL VARIABLES & INITIALIZATION
// ============================================

let pyodide = null;
let recognition = null; // Speech recognition instance
let isListening = false;

// ============================================
// SECTION 4: UTILITY FUNCTIONS
// ============================================

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: success, error, warning, info
 */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'info' ? 'info-circle' : 'check-circle'}"></i>
        <span>${escapeHtml(message)}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

/**
 * Save state to localStorage
 */
function saveState() {
    try {
        localStorage.setItem('sahu_state', JSON.stringify({
            activeProviders: state.activeProviders,
            selectedModels: state.selectedModels,
            customProviders: state.customProviders,
            features: state.features,
            deepThinkEnabled: state.deepThinkEnabled,
            thinkingBudget: state.thinkingBudget,
            autoFallback: state.autoFallback,
            aggregationStyle: state.aggregationStyle,
            stageSelector: state.stageSelector,
            promptRefinerEnabled: state.promptRefinerEnabled,
            safetyModels: state.safetyModels,
            voiceConfig: state.voiceConfig,
            activeSearchEngines: state.activeSearchEngines,
            customSearchEngines: state.customSearchEngines,
            researchConfig: state.researchConfig,
            customInstructions: state.customInstructions,
            language: state.language,
            temperature: state.temperature,
            maxTokens: state.maxTokens,
            singleModelMode: state.singleModelMode,
            singleModelId: state.singleModelId,
            modelResponseCounts: state.modelResponseCounts,
            theme: state.theme,
            pinnedMessages: state.pinnedMessages
        }));
        localStorage.setItem('sahu_chat_history', JSON.stringify(state.chatHistory));
        localStorage.setItem('sahu_theme', state.theme);
        localStorage.setItem('sahu_language', state.language);
    } catch (e) {
        console.error('Failed to save state:', e);
    }
}

/**
 * Load state from localStorage
 */
function loadState() {
    try {
        const saved = localStorage.getItem('sahu_state');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(state, parsed);
        }
        
        const history = localStorage.getItem('sahu_chat_history');
        if (history) {
            state.chatHistory = JSON.parse(history);
        }
        
        const theme = localStorage.getItem('sahu_theme');
        if (theme) {
            state.theme = theme;
        }
        
        const language = localStorage.getItem('sahu_language');
        if (language) {
            state.language = language;
        }
    } catch (e) {
        console.error('Failed to load state:', e);
    }
}

/**
 * Generate unique ID
 * @returns {string} - Unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format bytes to human readable
 * @param {number} bytes - Bytes
 * @returns {string} - Formatted size
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Check if query matches identity patterns
 * @param {string} query - User query
 * @returns {boolean} - True if identity query
 */
function checkIdentityQuery(query) {
    return IDENTITY_PATTERNS.some(pattern => pattern.test(query));
}

/**
 * Display identity response
 */
function displayIdentityResponse() {
    const container = document.getElementById('messagesContainer');
    const welcome = document.getElementById('welcomeScreen');
    
    if (welcome) welcome.classList.add('hidden');
    if (container) {
        container.classList.remove('hidden');
        container.innerHTML += `
            <div class="message-container message-assistant">
                <div class="message-bubble">
                    <div class="message-content">${IDENTITY_RESPONSE.replace(/\n/g, '<br>')}</div>
                    <div class="message-meta">
                        <span>SahuAI Agent</span>
                        <span>v5.0</span>
                    </div>
                </div>
            </div>
        `;
        container.scrollTop = container.scrollHeight;
    }
    
    // Save to chat history
    if (state.currentChatId) {
        state.messages.push({
            role: 'assistant',
            content: IDENTITY_RESPONSE,
            timestamp: Date.now()
        });
        updateChatHistory();
    }
}

// ============================================
// SECTION 5: UI FUNCTIONS
// ============================================

/**
 * Toggle sidebar visibility
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
}

/**
 * Toggle DeepThink from main button
 */
function toggleDeepThink() {
    state.deepThinkEnabled = !state.deepThinkEnabled;
    const btn = document.getElementById('deepThinkBtn');
    if (btn) {
        btn.classList.toggle('text-[var(--accent)]', state.deepThinkEnabled);
        btn.classList.toggle('text-[var(--text-secondary)]', !state.deepThinkEnabled);
    }
    showToast(state.deepThinkEnabled ? 'DeepThink Enabled (All Models)' : 'DeepThink Disabled');
    saveState();
}

/**
 * Toggle DeepThink from tools menu
 * @param {boolean} checked - Toggle state
 */
function toggleDeepThinkFromMenu(checked) {
    state.deepThinkEnabled = checked;
    showToast(checked ? 'DeepThink Enabled' : 'DeepThink Disabled');
    saveState();
}

/**
 * Toggle Web Search from tools menu
 * @param {boolean} checked - Toggle state
 */
function toggleWebSearchFromMenu(checked) {
    showToast(checked ? 'Web Search Enabled' : 'Web Search Disabled');
}

/**
 * Toggle Translate from tools menu
 * @param {boolean} checked - Toggle state
 */
function toggleTranslateFromMenu(checked) {
    state.translationEnabled = checked;
    const panel = document.getElementById('translationPanel');
    if (panel) {
        panel.classList.toggle('show', checked);
    }
    showToast(checked ? 'Translate Enabled' : 'Translate Disabled');
    saveState();
}

/**
 * Update current mode
 * @param {string} mode - New mode
 */
function updateMode(mode) {
    state.mode = mode;
    const btn = document.getElementById('taskTypeBtn');
    const welcome = document.getElementById('defaultWelcomeContent');
    const discovery = document.getElementById('discoveryFeed');
    const translateContainer = document.getElementById('toolTranslateContainer');
    const translatePanel = document.getElementById('translationPanel');
    
    // Set Thinking Budget Defaults based on Mode
    if (mode === 'research') {
        state.thinkingBudget = 'ultra';
        state.deepThinkEnabled = true; // Force ON
    } else if (mode === 'task') {
        if (state.taskType === 'file_creation') {
            state.thinkingBudget = 'balanced';
        } else {
            state.thinkingBudget = 'ultra'; // vibe or agentic
        }
        state.deepThinkEnabled = true;
    } else {
        state.thinkingBudget = 'balanced'; // Standard default
    }
    
    const budgetSelect = document.getElementById('thinkingBudget');
    if (budgetSelect) budgetSelect.value = state.thinkingBudget;
    
    // Handle mode-specific UI
    if (mode === 'task') {
        if (btn) {
            btn.classList.remove('hidden');
            if (!['vibe', 'agentic', 'file_creation'].includes(state.taskType)) state.taskType = 'vibe';
            updateTaskTypeLabel();
        }
        showToast('Task Mode Active');
    } else {
        if (btn) btn.classList.add('hidden');
    }
    
    // Translate only visible in Search mode
    if (translateContainer) {
        translateContainer.style.display = mode === 'search' ? 'flex' : 'none';
    }
    if (translatePanel) {
        translatePanel.classList.toggle('show', mode === 'search' && state.translationEnabled);
    }
    
    if (mode === 'search') {
        document.body.classList.add('mode-search-ui');
        if (state.messages.length === 0) {
            if (welcome) welcome.style.display = 'none';
            if (discovery) {
                discovery.style.display = 'grid';
                renderDiscovery();
            }
        }
        showToast('SahuAI Search Mode: Conversational & Cited');
    } else {
        document.body.classList.remove('mode-search-ui');
        if (welcome) welcome.style.display = 'block';
        if (discovery) discovery.style.display = 'none';
    }
    
    if (mode !== 'task' && mode !== 'search') {
        showToast('Mode: ' + mode.charAt(0).toUpperCase() + mode.slice(1));
    }
    
    saveState();
}

/**
 * Toggle task type (Vibe/Agentic/File Creation)
 */
function toggleTaskType() {
    if (state.taskType === 'vibe') state.taskType = 'agentic';
    else if (state.taskType === 'agentic') state.taskType = 'file_creation';
    else state.taskType = 'vibe';
    
    updateTaskTypeLabel();
    updateMode('task');
}

/**
 * Update task type button label
 */
function updateTaskTypeLabel() {
    const btn = document.getElementById('taskTypeBtn');
    const label = document.getElementById('taskTypeLabel');
    
    if (!btn || !label) return;
    
    if (state.taskType === 'vibe') {
        label.textContent = 'VIBE';
        btn.className = 'p-2 rounded-xl task-btn-vibe transition-all active:scale-95 font-bold text-xs flex items-center gap-1';
    } else if (state.taskType === 'agentic') {
        label.textContent = 'AGENTIC';
        btn.className = 'p-2 rounded-xl task-btn-agentic transition-all active:scale-95 font-bold text-xs flex items-center gap-1';
    } else {
        label.textContent = 'CREATE FILE';
        btn.className = 'p-2 rounded-xl task-btn-file transition-all active:scale-95 font-bold text-xs flex items-center gap-1';
    }
    showToast(`Task Type: ${label.textContent}`);
}

/**
 * Open settings modal
 */
function openSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('show');
        navigateSettings('main');
        
        renderApiKeyInputs();
        renderProviderCheckboxes();
        renderLanguageSelector();
        renderSearchEngines();
        renderResearchConfig();
        
        // Set current values
        const stageSelector = document.getElementById('stageSelector');
        if (stageSelector) stageSelector.value = state.stageSelector || '1';
        
        const autoFallback = document.getElementById('autoFallback');
        if (autoFallback) autoFallback.checked = state.autoFallback;
        
        const promptRefinerCheck = document.getElementById('promptRefinerCheck');
        if (promptRefinerCheck) promptRefinerCheck.checked = state.promptRefinerEnabled;
        
        const customInstructionsUser = document.getElementById('customInstructionsUser');
        if (customInstructionsUser) customInstructionsUser.value = state.customInstructions.user || '';
        
        const customInstructionsResp = document.getElementById('customInstructionsResp');
        if (customInstructionsResp) customInstructionsResp.value = state.customInstructions.resp || '';
        
        const settingTemp = document.getElementById('settingTemp');
        if (settingTemp) settingTemp.value = state.temperature;
        
        const settingMaxTokens = document.getElementById('settingMaxTokens');
        if (settingMaxTokens) settingMaxTokens.value = state.maxTokens;
        
        const thinkingBudget = document.getElementById('thinkingBudget');
        if (thinkingBudget) thinkingBudget.value = state.thinkingBudget || 'balanced';
        
        const aggregationStyle = document.getElementById('aggregationStyle');
        if (aggregationStyle) aggregationStyle.value = state.aggregationStyle || 'synthesis';
        
        // Set v5.0 feature toggles
        document.getElementById('neuralConsensusCheck').checked = state.features.neuralConsensus;
        document.getElementById('debateModeCheck').checked = state.features.debateMode;
        document.getElementById('temporalReasoningCheck').checked = state.features.temporalReasoning;
        document.getElementById('adaptiveReasoningCheck').checked = state.features.adaptiveReasoning;
        document.getElementById('uncertaintyBadgeCheck').checked = state.features.uncertaintyBadge;
        document.getElementById('tokenEstimatorCheck').checked = state.features.tokenEstimator;
        document.getElementById('responseRatingCheck').checked = state.features.responseRating;
        document.getElementById('threeTierMemoryCheck').checked = state.features.threeTierMemory;
        document.getElementById('selfCorrectingCodeCheck').checked = state.features.selfCorrectingCode;
        document.getElementById('usageAnalyticsCheck').checked = state.features.usageAnalytics;
        document.getElementById('agentSwarmCheck').checked = state.features.agentSwarm;
        document.getElementById('rapidLearningCheck').checked = state.features.rapidLearning;
        document.getElementById('physicalIntegrationCheck').checked = state.features.physicalIntegration;
        document.getElementById('constitutionalSafetyCheck').checked = state.features.constitutionalSafety;
        
        // Set safety models
        document.getElementById('safetyGraniteCheck').checked = state.safetyModels.graniteGuard;
        document.getElementById('safetyShieldGemmaCheck').checked = state.safetyModels.shieldGemma;
        document.getElementById('safetyLlamaGuardCheck').checked = state.safetyModels.llamaGuard;
        
        // Set voice config
        document.getElementById('asrModelSelect').value = state.voiceConfig.asr;
        document.getElementById('ttsModelSelect').value = state.voiceConfig.tts;
        
        // Set single model mode
        document.getElementById('singleModelCheck').checked = state.singleModelMode;
        document.getElementById('singleModelSelect').value = state.singleModelId;
        document.getElementById('singleModelSelectContainer').classList.toggle('hidden', !state.singleModelMode);
    }
    toggleSidebar();
}

/**
 * Close settings modal
 */
function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.remove('show');
}

/**
 * Navigate settings views
 * @param {string} view - View name
 */
function navigateSettings(view) {
    document.querySelectorAll('.settings-view').forEach(el => el.classList.remove('active'));
    const target = document.getElementById(`settings-${view}`);
    if (target) target.classList.add('active');
    
    const title = document.getElementById('settingsTitle');
    const backBtn = document.getElementById('settingsBackBtn');
    
    if (view === 'main') {
        if (title) title.innerHTML = '<i class="fas fa-cog"></i><span>Settings</span>';
        if (backBtn) backBtn.classList.add('hidden');
    } else {
        let name = view.charAt(0).toUpperCase() + view.slice(1);
        if (view === 'keys') name = 'API Keys';
        if (view === 'search') name = 'Search Engines';
        if (view === 'configuration') name = 'Configuration';
        if (view === 'customize') name = 'Customize';
        if (view === 'advanced') name = 'Advanced Features';
        if (title) title.textContent = name;
        if (backBtn) backBtn.classList.remove('hidden');
    }
}

/**
 * Open source code modal
 */
function openSourceCode() {
    const modal = document.getElementById('sourceCodeModal');
    const viewer = document.getElementById('sourceCodeViewer');
    if (modal && viewer) {
        modal.classList.add('show');
        viewer.value = document.documentElement.outerHTML;
    }
    closeSettings();
}

/**
 * Close source code modal
 */
function closeSourceCode() {
    const modal = document.getElementById('sourceCodeModal');
    if (modal) modal.classList.remove('show');
}

/**
 * Copy source code to clipboard
 */
function copySourceCode() {
    const viewer = document.getElementById('sourceCodeViewer');
    if (viewer) {
        viewer.select();
        navigator.clipboard.writeText(viewer.value).then(() => showToast('Source Code Copied!'));
    }
}

/**
 * Toggle theme (light/dark)
 */
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode');
    const icon = document.getElementById('themeIcon');
    const text = document.getElementById('themeText');
    if (icon) icon.className = state.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    if (text) text.textContent = state.theme === 'dark' ? 'Dark Mode' : 'Light Mode';
    localStorage.setItem('sahu_theme', state.theme);
}

/**
 * Open documentation modal
 */
function openDocs() {
    const modal = document.getElementById('docsModal');
    if (modal) {
        modal.classList.add('show');
    }
    closeSettings();
}

/**
 * Close documentation modal
 */
function closeDocs() {
    const modal = document.getElementById('docsModal');
    if (modal) modal.classList.remove('show');
}

/**
 * Toggle tools menu popover
 */
function toggleToolsMenu() {
    const menu = document.getElementById('toolsMenu');
    const langCard = document.getElementById('languageCard');
    if (menu) {
        menu.classList.toggle('show');
        if (langCard) langCard.classList.remove('show');
    }
}

/**
 * Toggle language card popover
 * @param {boolean} show - Show or hide
 */
function toggleLanguageCard(show) {
    const card = document.getElementById('languageCard');
    if (card) {
        if (show) {
            card.classList.add('show');
            renderLanguageList();
        } else {
            card.classList.remove('show');
        }
    }
}

/**
 * Render language list
 */
function renderLanguageList() {
    const list = document.getElementById('langList');
    const search = document.getElementById('langSearch');
    if (!list) return;
    
    const query = search ? search.value.toLowerCase() : '';
    const filtered = LANGUAGES.filter(l =>
        l.name.toLowerCase().includes(query) || l.code.toLowerCase().includes(query)
    );
    
    list.innerHTML = filtered.map(l => `
        <div class="language-item" onclick="selectLanguage('${l.code}')">
            ${l.name}
            <span class="language-item-code">(${l.code})</span>
        </div>
    `).join('');
}

/**
 * Filter languages by search query
 * @param {string} query - Search query
 */
function filterLanguages(query) {
    renderLanguageList();
}

/**
 * Select language
 * @param {string} code - Language code
 */
function selectLanguage(code) {
    state.language = code;
    updateLanguage(code);
    localStorage.setItem('sahu_language', code);
    toggleLanguageCard(false);
    const lang = LANGUAGES.find(l => l.code === code);
    showToast(`Language: ${lang ? lang.name : code}`);
    saveState();
}

/**
 * Update UI language
 * @param {string} langCode - Language code
 */
function updateLanguage(langCode) {
    state.language = langCode;
    const t = UI_TRANSLATIONS[langCode];
    
    const setTxt = (id, key, def) => {
        const el = document.getElementById(id);
        if (el) {
            const original = el.innerHTML;
            if (t && t[key]) {
                el.innerHTML = t[key].includes('<') ? t[key] : (original.includes('<i') ? original.replace(/<\/i>\s*(.*)/, `</i> ${t[key]}`) : t[key]);
            } else if (def) {
                el.innerHTML = original.replace(/<\/i>\s*(.*)/, `</i> ${def}`);
            }
        }
    };
    
    if (t) {
        const nc = document.getElementById('btn-new-chat');
        if (nc) nc.innerHTML = `<i class="fas fa-plus"></i>${t.newChat || 'New Chat'}`;
        
        const inst = document.getElementById('btn-install');
        if (inst) inst.innerHTML = `<i class="fab fa-android text-green-600"></i><span>${t.install || 'Install Android App'}</span>`;
        
        const sets = document.getElementById('btn-settings');
        if (sets) sets.innerHTML = `<i class="fas fa-cog text-[var(--text-secondary)]"></i><span class="text-sm">${t.settings || 'Settings'}</span>`;
        
        const conf = document.getElementById('btn-config-models');
        if (conf) conf.innerHTML = `<span class="flex items-center gap-2"><i class="fas fa-cubes text-[var(--accent)]"></i>${t.config || 'Configure Models'}</span><span id="selectedModelCount" class="text-xs bg-[var(--accent)] text-white px-2 py-0.5 rounded-full">${state.selectedModels.length}</span>`;
        
        const docs = document.querySelector('#docsModal .modal-title span');
        if (docs) docs.textContent = t.docs || 'Documentation';
    } else {
        if (langCode === 'en') {
            const nc = document.getElementById('btn-new-chat');
            if (nc) nc.innerHTML = `<i class="fas fa-plus"></i> New Chat`;
        }
    }
}

/**
 * Toggle prompt refiner panel
 */
function togglePromptRefinerPanel() {
    const panel = document.getElementById('promptRefinerPanel');
    if (panel) {
        panel.classList.toggle('show');
    }
}

/**
 * Toggle prompt refiner setting
 * @param {boolean} checked - Toggle state
 */
function togglePromptRefinerSetting(checked) {
    state.promptRefinerEnabled = checked;
    const panel = document.getElementById('pipelinePromptRefinerPanel');
    if (panel) {
        panel.classList.toggle('show', checked);
    }
    saveState();
}

/**
 * Toggle single model mode
 * @param {boolean} checked - Toggle state
 */
function toggleSingleModelMode(checked) {
    state.singleModelMode = checked;
    const container = document.getElementById('singleModelSelectContainer');
    if (container) {
        container.classList.toggle('hidden', !checked);
    }
    saveState();
}

// ============================================
// SECTION 6: SETTINGS FUNCTIONS
// ============================================

/**
 * Render research configuration
 */
function renderResearchConfig() {
    const container = document.getElementById('researchStagesConfig');
    if (!container) return;
    
    let modelOptions = '<option value="">Default (First Available)</option>';
    state.activeProviders.forEach(p => {
        const provider = PROVIDERS[p] || state.customProviders.find(cp => cp.name === p);
        if (provider && provider.models) {
            Object.keys(provider.models).forEach(mName => {
                const mId = provider.models[mName];
                modelOptions += `<option value="${p}|${mId}">${mName} (${provider.name})</option>`;
            });
        }
    });
    
    container.innerHTML = RESEARCH_STAGES.map(stage => {
        let expertSelectors = '';
        
        if (stage.id === 'stage5') {
            const configKey = `${stage.id}_agg`;
            const saved = state.researchConfig[configKey] || '';
            expertSelectors = `
                <div class="mb-2">
                    <label class="text-[10px] text-[var(--text-secondary)] block mb-1 font-bold">Super Master Model</label>
                    <select class="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-xs outline-none"
                            id="conf_${configKey}" onchange="updateResearchStageConfig('${configKey}', this.value)">
                        ${modelOptions.replace(`value="${saved}"`, `value="${saved}" selected`)}
                    </select>
                </div>
            `;
        } else {
            expertSelectors = stage.experts.map((exp, idx) => {
                const configKey = `${stage.id}_${idx}`;
                const saved = state.researchConfig[configKey] || '';
                return `
                <div class="mb-2 pl-2 border-l-2 border-[var(--border)]">
                    <label class="text-[10px] text-[var(--text-secondary)] block mb-1 truncate">${exp}</label>
                    <select class="w-full p-1.5 rounded bg-[var(--bg-secondary)] border border-[var(--border)] text-[10px] outline-none"
                            id="conf_${configKey}" onchange="updateResearchStageConfig('${configKey}', this.value)">
                        ${modelOptions.replace(`value="${saved}"`, `value="${saved}" selected`)}
                    </select>
                </div>
                `;
            }).join('');
        }
        
        return `
        <div class="p-3 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border)] mb-2">
            <div class="font-medium text-sm mb-2 text-[var(--accent)]">${stage.name}</div>
            <div class="grid grid-cols-1 gap-1">
                ${expertSelectors}
            </div>
        </div>
        `;
    }).join('');
}

/**
 * Update research stage config
 * @param {string} key - Config key
 * @param {string} val - Config value
 */
function updateResearchStageConfig(key, val) {
    state.researchConfig[key] = val;
}

/**
 * Save all settings
 */
function saveSettings() {
    // Save API keys
    Object.keys(PROVIDERS).forEach(k => {
        const input = document.getElementById(`key_${k}`);
        if (input) localStorage.setItem(PROVIDERS[k].keyName, input.value);
    });
    
    // Save custom instructions
    state.customInstructions = {
        user: document.getElementById('customInstructionsUser')?.value || '',
        resp: document.getElementById('customInstructionsResp')?.value || ''
    };
    localStorage.setItem('sahu2_custom_instructions', JSON.stringify(state.customInstructions));
    
    // Save temperature/maxTokens
    const tempInput = document.getElementById('settingTemp');
    const maxTokensInput = document.getElementById('settingMaxTokens');
    if (tempInput) state.temperature = parseFloat(tempInput.value);
    if (maxTokensInput) state.maxTokens = parseInt(maxTokensInput.value);
    localStorage.setItem('sahu2_temp', state.temperature);
    localStorage.setItem('sahu2_max_tokens', state.maxTokens);
    
    // Save pipeline settings
    state.autoFallback = document.getElementById('autoFallback')?.checked ?? true;
    state.promptRefinerEnabled = document.getElementById('promptRefinerCheck')?.checked ?? true;
    localStorage.setItem('sahu_auto_fallback', state.autoFallback);
    localStorage.setItem('sahu_prompt_refiner', state.promptRefinerEnabled);
    
    // Save research settings
    const budgetSelect = document.getElementById('thinkingBudget');
    const styleSelect = document.getElementById('aggregationStyle');
    const stageSelect = document.getElementById('stageSelector');
    if (budgetSelect) state.thinkingBudget = budgetSelect.value;
    if (styleSelect) state.aggregationStyle = styleSelect.value;
    if (stageSelect) state.stageSelector = stageSelect.value;
    localStorage.setItem('sahu2_thinking_budget', state.thinkingBudget);
    localStorage.setItem('sahu2_aggregation_style', state.aggregationStyle);
    localStorage.setItem('sahu_stage_selector', state.stageSelector);
    
    // Save research config
    localStorage.setItem('sahu2_research_config', JSON.stringify(state.researchConfig));
    localStorage.setItem('sahu_search_engines', JSON.stringify(state.activeSearchEngines));
    
    // Save v5.0 feature toggles
    state.features.neuralConsensus = document.getElementById('neuralConsensusCheck')?.checked ?? true;
    state.features.debateMode = document.getElementById('debateModeCheck')?.checked ?? true;
    state.features.temporalReasoning = document.getElementById('temporalReasoningCheck')?.checked ?? true;
    state.features.adaptiveReasoning = document.getElementById('adaptiveReasoningCheck')?.checked ?? true;
    state.features.uncertaintyBadge = document.getElementById('uncertaintyBadgeCheck')?.checked ?? true;
    state.features.tokenEstimator = document.getElementById('tokenEstimatorCheck')?.checked ?? true;
    state.features.responseRating = document.getElementById('responseRatingCheck')?.checked ?? true;
    state.features.threeTierMemory = document.getElementById('threeTierMemoryCheck')?.checked ?? true;
    state.features.selfCorrectingCode = document.getElementById('selfCorrectingCodeCheck')?.checked ?? true;
    state.features.usageAnalytics = document.getElementById('usageAnalyticsCheck')?.checked ?? true;
    state.features.agentSwarm = document.getElementById('agentSwarmCheck')?.checked ?? true;
    state.features.rapidLearning = document.getElementById('rapidLearningCheck')?.checked ?? true;
    state.features.physicalIntegration = document.getElementById('physicalIntegrationCheck')?.checked ?? true;
    state.features.constitutionalSafety = document.getElementById('constitutionalSafetyCheck')?.checked ?? true;
    localStorage.setItem('sahu2_features', JSON.stringify(state.features));
    
    // Save safety models
    state.safetyModels.graniteGuard = document.getElementById('safetyGraniteCheck')?.checked ?? true;
    state.safetyModels.shieldGemma = document.getElementById('safetyShieldGemmaCheck')?.checked ?? true;
    state.safetyModels.llamaGuard = document.getElementById('safetyLlamaGuardCheck')?.checked ?? true;
    localStorage.setItem('sahu_safety_models', JSON.stringify(state.safetyModels));
    
    // Save voice config
    state.voiceConfig.asr = document.getElementById('asrModelSelect')?.value || 'openai/whisper-large-v3';
    state.voiceConfig.tts = document.getElementById('ttsModelSelect')?.value || 'nvidia/magpie-tts-multilingual';
    localStorage.setItem('sahu_voice_config', JSON.stringify(state.voiceConfig));
    
    // Save single model mode
    state.singleModelMode = document.getElementById('singleModelCheck')?.checked ?? false;
    state.singleModelId = document.getElementById('singleModelSelect')?.value || 'minimaxai/minimax-m2.1';
    localStorage.setItem('sahu_single_model_mode', state.singleModelMode);
    localStorage.setItem('sahu_single_model_id', state.singleModelId);
    
    // Save language
    const langSelect = document.getElementById('languageSelector');
    if (langSelect) {
        state.language = langSelect.value;
        updateLanguage(state.language);
        localStorage.setItem('sahu_language', state.language);
    }
    
    closeSettings();
    showToast('Settings Saved!');
    saveState();
}

/**
 * Toggle provider
 * @param {string} key - Provider key
 * @param {boolean} checked - Toggle state
 */
function toggleProvider(key, checked) {
    if (checked) {
        if (!state.activeProviders.includes(key)) state.activeProviders.push(key);
    } else {
        state.activeProviders = state.activeProviders.filter(p => p !== key);
    }
    localStorage.setItem('sahu_active_providers', JSON.stringify(state.activeProviders));
    renderProviderCheckboxes();
    updateUI();
    saveState();
}

/**
 * Render provider checkboxes
 */
function renderProviderCheckboxes() {
    const container = document.getElementById('providerCheckboxes');
    if (!container) return;
    
    container.innerHTML = Object.entries(PROVIDERS).map(([k, p]) => `
        <label class="provider-item ${state.activeProviders.includes(k) ? 'active' : ''}">
            <input type="checkbox" class="provider-checkbox" ${state.activeProviders.includes(k) ? 'checked' : ''} onchange="toggleProvider('${k}', this.checked)">
            <div class="provider-info">
                <div class="provider-name">
                    <span class="provider-icon">${p.icon}</span>
                    <span>${p.name}</span>
                </div>
            </div>
        </label>
    `).join('');
}

/**
 * Render API key inputs
 */
function renderApiKeyInputs() {
    const c = document.getElementById('apiKeyInputs');
    if (!c) return;
    
    c.innerHTML = Object.entries(PROVIDERS).map(([k, p]) => `
        <div class="api-key-item">
            <div class="api-key-header">
                <span class="provider-icon">${p.icon}</span>
                <span class="api-key-provider">${p.name}</span>
            </div>
            <input type="password" id="key_${k}" placeholder="Enter API Key" class="api-key-input">
        </div>
    `).join('');
    
    Object.keys(PROVIDERS).forEach(k => {
        const v = localStorage.getItem(PROVIDERS[k].keyName);
        const input = document.getElementById(`key_${k}`);
        if (v && input) input.value = v;
    });
}

/**
 * Render language selector
 */
function renderLanguageSelector() {
    const sel = document.getElementById('languageSelector');
    if (!sel) return;
    sel.innerHTML = LANGUAGES.map(l => `<option value="${l.code}" ${state.language === l.code ? 'selected' : ''}>${l.name}</option>`).join('');
}

/**
 * Render search engines
 */
function renderSearchEngines() {
    const list = document.getElementById('searchEngineList');
    if (!list) return;
    
    const allEngines = { ...SEARCH_ENGINES_CONFIG };
    state.customSearchEngines.forEach(eng => {
        allEngines[eng.id] = { name: eng.name, type: eng.type };
    });
    
    list.innerHTML = Object.entries(allEngines).map(([key, config]) => `
        <label class="search-engine-item">
            <input type="checkbox" class="search-engine-checkbox" ${state.activeSearchEngines.includes(key) ? 'checked' : ''} onchange="toggleSearchEngine('${key}', this.checked)">
            <div class="search-engine-info">
                <div class="search-engine-name">${config.name}</div>
                <div class="search-engine-type">${config.type === 'api' ? '(API)' : '(SearXNG)'}</div>
            </div>
        </label>
    `).join('');
}

/**
 * Toggle search engine
 * @param {string} key - Engine key
 * @param {boolean} checked - Toggle state
 */
function toggleSearchEngine(key, checked) {
    if (checked) {
        if (!state.activeSearchEngines.includes(key)) state.activeSearchEngines.push(key);
    } else {
        state.activeSearchEngines = state.activeSearchEngines.filter(k => k !== key);
    }
}

/**
 * Toggle all search engines
 */
function toggleAllSearchEngines() {
    const allKeys = Object.keys(SEARCH_ENGINES_CONFIG);
    if (state.activeSearchEngines.length === allKeys.length) {
        state.activeSearchEngines = [];
    } else {
        state.activeSearchEngines = [...allKeys];
    }
    renderSearchEngines();
}

/**
 * Add custom search engine
 */
function addCustomSearchEngine() {
    const name = document.getElementById('customEngineName')?.value;
    const url = document.getElementById('customEngineUrl')?.value;
    const key = document.getElementById('customEngineKey')?.value;
    const type = document.getElementById('customEngineType')?.value;
    
    if (!name || !url) {
        showToast('Please fill in Name and URL', 'error');
        return;
    }
    
    const id = 'custom_' + generateId();
    state.customSearchEngines.push({ id, name, url, key, type });
    localStorage.setItem('sahu_custom_engines', JSON.stringify(state.customSearchEngines));
    
    showToast('Custom search engine added!');
    renderSearchEngines();
    
    // Clear inputs
    document.getElementById('customEngineName').value = '';
    document.getElementById('customEngineUrl').value = '';
    document.getElementById('customEngineKey').value = '';
}

/**
 * Add custom provider
 */
function addCustomProvider() {
    const name = document.getElementById('customProviderName')?.value;
    const endpoint = document.getElementById('customProviderEndpoint')?.value;
    const key = document.getElementById('customProviderKey')?.value;
    const modelId = document.getElementById('customProviderModelId')?.value;
    const modelName = document.getElementById('customProviderModelName')?.value || modelId;
    
    if (!name || !endpoint || !modelId) {
        showToast('Please fill in Name, Endpoint, and Model ID', 'error');
        return;
    }
    
    const id = 'custom_' + generateId();
    const provider = {
        id,
        name,
        endpoint,
        keyName: `sahu_${id}_key`,
        models: { [modelName || modelId]: modelId }
    };
    
    state.customProviders.push(provider);
    localStorage.setItem(PROVIDERS[k].keyName, key);
    localStorage.setItem('sahu_custom_providers', JSON.stringify(state.customProviders));
    
    showToast('Custom provider added!');
    renderProviderCheckboxes();
    
    // Clear inputs
    document.getElementById('customProviderName').value = '';
    document.getElementById('customProviderEndpoint').value = '';
    document.getElementById('customProviderKey').value = '';
    document.getElementById('customProviderModelId').value = '';
    document.getElementById('customProviderModelName').value = '';
}

// ============================================
// CONTINUED IN NEXT MESSAGE (due to length)
// ============================================
// ============================================
// SECTION 7: MODEL SELECTOR FUNCTIONS
// ============================================

/**
 * Open model selector modal
 */
function openModelSelector() {
    const modal = document.getElementById('modelSelectorModal');
    if (modal) {
        modal.classList.add('show');
        renderModelSelector();
    }
    closeSettings();
}

/**
 * Close model selector modal
 */
function closeModelSelector() {
    const modal = document.getElementById('modelSelectorModal');
    if (modal) modal.classList.remove('show');
}

/**
 * Toggle all models for a provider
 * @param {string} providerKey - Provider key
 */
function toggleAllModels(providerKey) {
    const provider = PROVIDERS[providerKey];
    if (!provider) return;
    
    const all = Object.entries(provider.models);
    const selected = all.filter(([mk]) =>
        state.selectedModels.find(m => m.provider === providerKey && m.modelKey === mk)
    ).length;
    
    const isAll = selected === all.length;
    
    if (isAll) {
        state.selectedModels = state.selectedModels.filter(m => m.provider !== providerKey);
    } else {
        all.forEach(([mk, mid]) => {
            if (!state.selectedModels.find(m => m.provider === providerKey && m.modelKey === mk)) {
                state.selectedModels.push({
                    provider: providerKey,
                    modelKey: mk,
                    modelId: mid,
                    stage: 'none',
                    count: 1
                });
            }
        });
    }
    
    renderModelSelector();
}

/**
 * Toggle model selection
 * @param {string} provider - Provider key
 * @param {string} modelKey - Model key
 * @param {string} modelId - Model ID
 * @param {boolean} selected - Selection state
 */
function toggleModelSelection(provider, modelKey, modelId, selected) {
    if (selected) {
        if (!state.selectedModels.find(m => m.provider === provider && m.modelKey === modelKey)) {
            state.selectedModels.push({
                provider,
                modelKey,
                modelId,
                stage: 'none',
                count: 1
            });
        }
    } else {
        state.selectedModels = state.selectedModels.filter(
            m => !(m.provider === provider && m.modelKey === modelKey)
        );
    }
    renderModelSelector();
}

/**
 * Set model stage for aggregation
 * @param {string} provider - Provider key
 * @param {string} modelKey - Model key
 * @param {string} modelId - Model ID
 * @param {string} stage - Stage (1, 2, 3)
 * @param {Event} event - Click event
 */
function setModelStage(provider, modelKey, modelId, stage, event) {
    if (event) event.stopPropagation();
    
    let model = state.selectedModels.find(
        m => m.provider === provider && m.modelKey === modelKey
    );
    
    if (!model) {
        model = { provider, modelKey, modelId, stage: 'none', count: 1 };
        state.selectedModels.push(model);
    }
    
    if (model.stage === stage) {
        model.stage = 'none';
    } else {
        state.selectedModels.forEach(m => {
            if (m.stage === stage) m.stage = 'none';
        });
        model.stage = stage;
    }
    
    renderModelSelector();
}

/**
 * Set model response count (1x, 2x, 3x)
 * @param {string} provider - Provider key
 * @param {string} modelKey - Model key
 * @param {number} count - Response count
 */
function setModelResponseCount(provider, modelKey, count) {
    let model = state.selectedModels.find(
        m => m.provider === provider && m.modelKey === modelKey
    );
    
    if (model) {
        model.count = count;
    } else {
        const providerData = PROVIDERS[provider];
        if (providerData) {
            const modelId = providerData.models[modelKey];
            state.selectedModels.push({
                provider,
                modelKey,
                modelId,
                stage: 'none',
                count: count
            });
        }
    }
    
    renderModelSelector();
}

/**
 * Save model selection
 */
function saveModelSelection() {
    localStorage.setItem('sahu_selected_models', JSON.stringify(state.selectedModels));
    localStorage.setItem('sahu_model_response_counts', JSON.stringify(state.modelResponseCounts));
    closeModelSelector();
    updateUI();
    showToast(`${state.selectedModels.length} models configured`);
    saveState();
}

/**
 * Render model selector content
 */
function renderModelSelector() {
    const container = document.getElementById('modelSelectorContent');
    const countEl = document.getElementById('modalSelectedCount');
    
    if (!container) return;
    
    let html = '';
    
    // Render built-in providers
    Object.entries(PROVIDERS).forEach(([providerKey, provider]) => {
        if (!state.activeProviders.includes(providerKey)) return;
        
        html += `
        <div class="model-provider-section">
            <div class="model-provider-header">
                <div class="model-provider-title">
                    <span class="model-provider-icon">${provider.icon}</span>
                    <span class="model-provider-name">${provider.name}</span>
                    <span class="model-provider-count">(${Object.keys(provider.models).length})</span>
                </div>
                <button onclick="toggleAllModels('${providerKey}')" class="model-provider-select-all">
                    Select All/None
                </button>
            </div>
            <div class="model-provider-list">
                ${Object.entries(provider.models).map(([modelKey, modelId]) => {
                    const selected = state.selectedModels.find(
                        m => m.provider === providerKey && m.modelKey === modelKey
                    );
                    const stage = selected?.stage || 'none';
                    const count = selected?.count || 1;
                    
                    return `
                    <div class="model-card ${selected ? 'selected' : ''}">
                        <input type="checkbox" class="model-checkbox"
                            ${selected ? 'checked' : ''}
                            onchange="toggleModelSelection('${providerKey}', '${modelKey}', '${modelId}', this.checked)">
                        <div class="model-info">
                            <div class="model-name">${modelKey}</div>
                            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; align-items: center;">
                                <span style="font-size: 0.625rem; color: var(--text-secondary);">Count:</span>
                                <select onchange="setModelResponseCount('${providerKey}', '${modelKey}', parseInt(this.value))"
                                    style="font-size: 0.625rem; padding: 0.25rem; border-radius: 0.25rem; background: var(--bg-secondary); border: 1px solid var(--border);">
                                    <option value="1" ${count === 1 ? 'selected' : ''}>1x</option>
                                    <option value="2" ${count === 2 ? 'selected' : ''}>2x</option>
                                    <option value="3" ${count === 3 ? 'selected' : ''}>3x</option>
                                </select>
                            </div>
                        </div>
                        <div class="model-stages">
                            <button class="stage-btn ${stage === '1' ? 'active-1' : ''}"
                                onclick="setModelStage('${providerKey}', '${modelKey}', '${modelId}', '1', event)">1</button>
                            <button class="stage-btn ${stage === '2' ? 'active-2' : ''}"
                                onclick="setModelStage('${providerKey}', '${modelKey}', '${modelId}', '2', event)">2</button>
                            <button class="stage-btn ${stage === '3' ? 'active-3' : ''}"
                                onclick="setModelStage('${providerKey}', '${modelKey}', '${modelId}', '3', event)">3</button>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
        `;
    });
    
    // Render custom providers
    state.customProviders.forEach(provider => {
        if (!state.activeProviders.includes(provider.id)) return;
        
        html += `
        <div class="model-provider-section">
            <div class="model-provider-header">
                <div class="model-provider-title">
                    <span class="model-provider-icon">🔧</span>
                    <span class="model-provider-name">${provider.name} (Custom)</span>
                    <span class="model-provider-count">(${Object.keys(provider.models).length})</span>
                </div>
                <button onclick="toggleAllModels('${provider.id}')" class="model-provider-select-all">
                    Select All/None
                </button>
            </div>
            <div class="model-provider-list">
                ${Object.entries(provider.models).map(([modelKey, modelId]) => {
                    const selected = state.selectedModels.find(
                        m => m.provider === provider.id && m.modelKey === modelKey
                    );
                    const stage = selected?.stage || 'none';
                    const count = selected?.count || 1;
                    
                    return `
                    <div class="model-card ${selected ? 'selected' : ''}">
                        <input type="checkbox" class="model-checkbox"
                            ${selected ? 'checked' : ''}
                            onchange="toggleModelSelection('${provider.id}', '${modelKey}', '${modelId}', this.checked)">
                        <div class="model-info">
                            <div class="model-name">${modelKey}</div>
                            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; align-items: center;">
                                <span style="font-size: 0.625rem; color: var(--text-secondary);">Count:</span>
                                <select onchange="setModelResponseCount('${provider.id}', '${modelKey}', parseInt(this.value))"
                                    style="font-size: 0.625rem; padding: 0.25rem; border-radius: 0.25rem; background: var(--bg-secondary); border: 1px solid var(--border);">
                                    <option value="1" ${count === 1 ? 'selected' : ''}>1x</option>
                                    <option value="2" ${count === 2 ? 'selected' : ''}>2x</option>
                                    <option value="3" ${count === 3 ? 'selected' : ''}>3x</option>
                                </select>
                            </div>
                        </div>
                        <div class="model-stages">
                            <button class="stage-btn ${stage === '1' ? 'active-1' : ''}"
                                onclick="setModelStage('${provider.id}', '${modelKey}', '${modelId}', '1', event)">1</button>
                            <button class="stage-btn ${stage === '2' ? 'active-2' : ''}"
                                onclick="setModelStage('${provider.id}', '${modelKey}', '${modelId}', '2', event)">2</button>
                            <button class="stage-btn ${stage === '3' ? 'active-3' : ''}"
                                onclick="setModelStage('${provider.id}', '${modelKey}', '${modelId}', '3', event)">3</button>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
        `;
    });
    
    container.innerHTML = html || '<div class="text-center py-8 text-[var(--text-secondary)]">No providers selected. Go to Settings → Active Providers to enable providers.</div>';
    
    if (countEl) countEl.textContent = state.selectedModels.length;
}

// ============================================
// SECTION 8: CHAT MANAGEMENT FUNCTIONS
// ============================================

/**
 * Start new chat
 */
function newChat() {
    state.currentChatId = null;
    state.messages = [];
    
    const container = document.getElementById('messagesContainer');
    const welcome = document.getElementById('welcomeScreen');
    
    if (container) {
        container.innerHTML = '';
        container.classList.add('hidden');
    }
    if (welcome) welcome.classList.remove('hidden');
    
    const input = document.getElementById('userInput');
    if (input) input.value = '';
    
    removeFile();
    toggleSidebar();
    window.location.hash = '';
    
    if (state.mode === 'search') {
        const discovery = document.getElementById('discoveryFeed');
        if (discovery) {
            discovery.style.display = 'grid';
            renderDiscovery();
        }
    }
}

/**
 * Trigger file upload
 */
function triggerFileUpload() {
    const input = document.getElementById('fileInput');
    if (input) input.click();
}

/**
 * Handle file upload
 * @param {Event} event - Change event
 */
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        const text = await file.text().catch(() => 'BINARY_FILE_PLACEHOLDER');
        state.uploadedFile = file;
        state.uploadedFileContent = text.substring(0, 50000);
        
        const preview = document.getElementById('fileUploadPreview');
        if (preview) {
            preview.innerHTML = `
                <div class="file-preview-card">
                    <div class="file-preview-icon">
                        <i class="fas fa-file"></i>
                    </div>
                    <div class="file-preview-info">
                        <div class="file-preview-name">${escapeHtml(file.name)}</div>
                        <div class="file-preview-size">${formatBytes(file.size)}</div>
                    </div>
                    <div class="file-preview-remove" onclick="removeFile()">
                        <i class="fas fa-times text-[var(--text-secondary)]"></i>
                    </div>
                </div>
            `;
            preview.classList.add('show');
        }
    } catch (e) {
        showToast('Failed to read file', 'error');
    }
}

/**
 * Remove uploaded file
 */
function removeFile() {
    state.uploadedFile = null;
    state.uploadedFileContent = null;
    
    const preview = document.getElementById('fileUploadPreview');
    if (preview) preview.classList.remove('show');
    
    const input = document.getElementById('fileInput');
    if (input) input.value = '';
}

/**
 * Handle keyboard input
 * @param {KeyboardEvent} event - Keydown event
 */
function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
    if (event.key === 'Escape') {
        state.isProcessing = false;
    }
}

/**
 * Auto-resize textarea
 * @param {HTMLTextAreaElement} textarea - Textarea element
 */
function autoResize(textarea) {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

/**
 * Quick prompt from welcome screen
 * @param {string} text - Prompt text
 */
function quickPrompt(text) {
    const input = document.getElementById('userInput');
    if (input) {
        input.value = text;
        sendMessage();
    }
}

/**
 * Generate shareable link
 */
function generateShareLink() {
    if (state.messages.length === 0) {
        showToast('Chat empty', 'error');
        return;
    }
    
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(state.messages));
    window.location.hash = compressed;
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Share Link Copied!');
    });
}

/**
 * Load chat from history
 * @param {string} id - Chat ID
 */
function loadChat(id) {
    const chat = state.chatHistory.find(c => c.id === id);
    if (!chat) return;
    
    state.currentChatId = id;
    state.messages = chat.messages || [];
    
    const container = document.getElementById('messagesContainer');
    const welcome = document.getElementById('welcomeScreen');
    
    if (welcome) welcome.classList.add('hidden');
    if (container) {
        container.classList.remove('hidden');
        container.innerHTML = '';
        
        state.messages.forEach(msg => {
            if (msg.role === 'user') {
                container.innerHTML += `
                    <div class="message-container message-user">
                        <div class="message-bubble">
                            <div class="message-content">${escapeHtml(msg.content)}</div>
                        </div>
                    </div>
                `;
            } else if (msg.role === 'assistant') {
                container.innerHTML += `
                    <div class="message-container message-assistant">
                        <div class="message-bubble">
                            <div class="message-content">${formatMarkdown(msg.content)}</div>
                        </div>
                    </div>
                `;
            }
        });
        
        setTimeout(() => container.scrollTop = container.scrollHeight, 100);
    }
    
    if (window.innerWidth < 768) toggleSidebar();
}

/**
 * Filter chat history by search query
 * @param {string} query - Search query
 */
function filterHistory(query) {
    if (!query) {
        renderChatHistory();
        return;
    }
    
    try {
        const fuse = new Fuse(state.chatHistory, {
            keys: ['title', 'messages.content'],
            threshold: 0.4
        });
        const results = fuse.search(query);
        
        const historyEl = document.getElementById('chatHistory');
        if (historyEl) {
            historyEl.innerHTML = results.slice(0, 10).map(r => `
                <div class="history-item" onclick="loadChat('${r.item.id}')">
                    <i class="fas fa-search text-[var(--accent)]"></i>
                    <span class="history-item-title">${escapeHtml(r.item.title)}</span>
                </div>
            `).join('');
        }
    } catch (e) {
        console.error('Search error:', e);
    }
}

/**
 * Render chat history
 */
function renderChatHistory() {
    const el = document.getElementById('chatHistory');
    if (!el) return;
    
    el.innerHTML = state.chatHistory.slice(0, 50).map(chat => `
        <div class="history-item" onclick="loadChat('${chat.id}')">
            <i class="fas fa-message text-[var(--text-secondary)]"></i>
            <span class="history-item-title">${escapeHtml(chat.title)}</span>
        </div>
    `).join('');
}

/**
 * Load chat history from localStorage
 */
function loadChatHistory() {
    const saved = localStorage.getItem('sahu_chat_history');
    if (saved) {
        try {
            state.chatHistory = JSON.parse(saved);
            renderChatHistory();
        } catch (e) {
            console.error('Failed to load chat history:', e);
        }
    }
}

/**
 * Update chat history in localStorage
 */
function updateChatHistory() {
    const chatIndex = state.chatHistory.findIndex(c => c.id === state.currentChatId);
    
    if (chatIndex >= 0) {
        state.chatHistory[chatIndex].messages = state.messages;
        state.chatHistory[chatIndex].timestamp = Date.now();
    } else if (state.messages.length > 0) {
        state.chatHistory.unshift({
            id: state.currentChatId || generateId(),
            title: state.messages[0]?.content?.substring(0, 50) || 'New Chat',
            messages: state.messages,
            timestamp: Date.now()
        });
    }
    
    // Keep only last 100 chats
    state.chatHistory = state.chatHistory.slice(0, 100);
    
    localStorage.setItem('sahu_chat_history', JSON.stringify(state.chatHistory));
    renderChatHistory();
}

/**
 * Render pinned messages
 */
function renderPinned() {
    const container = document.getElementById('pinnedList');
    const section = document.getElementById('pinnedSection');
    
    if (!container || !section) return;
    
    if (state.pinnedMessages.length === 0) {
        section.classList.remove('show');
        return;
    }
    
    section.classList.add('show');
    container.innerHTML = state.pinnedMessages.map((msg, i) => `
        <div class="pinned-item" onclick="showToast('Jump to message')">
            <i class="fas fa-thumbtack text-yellow-500"></i>
            <span>${escapeHtml(msg.substring(0, 30))}...</span>
        </div>
    `).join('');
}

/**
 * Toggle pin message
 * @param {string} text - Message text
 */
function togglePin(text) {
    const index = state.pinnedMessages.indexOf(text);
    if (index > -1) {
        state.pinnedMessages.splice(index, 1);
    } else {
        state.pinnedMessages.push(text);
    }
    localStorage.setItem('sahu2_pinned', JSON.stringify(state.pinnedMessages));
    renderPinned();
}

/**
 * Update token counter
 */
function updateTokenCounter() {
    state.totalTokens = Math.ceil((window.lastAnswer?.length || 0) / 4);
    const el = document.getElementById('totalTokensVal');
    if (el) {
        el.textContent = state.totalTokens > 1000
            ? (state.totalTokens / 1000).toFixed(1) + 'k'
            : state.totalTokens;
    }
}

/**
 * Update UI elements
 */
function updateUI() {
    const countEl = document.getElementById('selectedModelCount');
    if (countEl) countEl.textContent = state.selectedModels.length;
    updateTokenCounter();
}

// ============================================
// SECTION 9: ARTIFACT & CANVAS FUNCTIONS
// ============================================

/**
 * Open artifact modal
 * @param {string} code - Code content
 * @param {string} type - Code type
 */
function openArtifact(code, type) {
    const modal = document.getElementById('artifactModal');
    const codeArea = document.getElementById('canvas-code-area');
    const frame = document.getElementById('canvas-frame');
    
    if (!modal || !codeArea || !frame) return;
    
    state.currentArtifact = { code, type };
    codeArea.value = code;
    
    if (type === 'html' || type === 'svg') {
        frame.srcdoc = code;
        switchCanvasTab('preview');
    } else {
        switchCanvasTab('code');
        frame.srcdoc = `
            <html>
                <body style="font-family:sans-serif;padding:20px;color:#666;">
                    <p>No preview available for ${type.toUpperCase()}.</p>
                    <p>View code in 'Code' tab.</p>
                </body>
            </html>
        `;
    }
    
    modal.classList.add('show');
}

/**
 * Close artifact modal
 */
function closeArtifact() {
    const modal = document.getElementById('artifactModal');
    if (modal) modal.classList.remove('show');
}

/**
 * Switch canvas tab
 * @param {string} tab - Tab name (code/preview)
 */
function switchCanvasTab(tab) {
    const tabCode = document.getElementById('tab-code');
    const tabPreview = document.getElementById('tab-preview');
    const editor = document.getElementById('canvas-editor');
    const preview = document.getElementById('canvas-preview');
    
    if (tabCode) tabCode.classList.toggle('active', tab === 'code');
    if (tabPreview) tabPreview.classList.toggle('active', tab === 'preview');
    if (editor) editor.classList.toggle('active', tab === 'code');
    if (preview) preview.classList.toggle('active', tab === 'preview');
    
    if (tab === 'preview' && (state.currentArtifact.type === 'html' || state.currentArtifact.type === 'svg')) {
        const code = document.getElementById('canvas-code-area')?.value;
        const frame = document.getElementById('canvas-frame');
        if (code && frame) frame.srcdoc = code;
    }
}

// ============================================
// SECTION 10: VOICE INPUT FUNCTIONS
// ============================================

/**
 * Start voice input
 */
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('Voice input not supported in this browser', 'error');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = state.language || 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    showToast('🎤 Listening...');
    isListening = true;
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('userInput');
        if (input) {
            input.value = transcript;
            autoResize(input);
        }
        showToast('✓ Voice input captured');
        isListening = false;
    };
    
    recognition.onerror = (event) => {
        showToast('Voice input error: ' + event.error, 'error');
        isListening = false;
    };
    
    recognition.onend = () => {
        isListening = false;
    };
    
    recognition.start();
}

// ============================================
// SECTION 11: TRANSLATION FUNCTIONS
// ============================================

/**
 * Translate response
 */
function translateResponse() {
    const source = document.getElementById('translationSource')?.value || 'auto';
    const target = document.getElementById('translationTarget')?.value || 'en';
    
    if (!window.lastAnswer) {
        showToast('No response to translate', 'error');
        return;
    }
    
    showToast('Translation in progress...');
    
    // Use translation model based on target language
    const modelId = TRANSLATION_MODELS[target] || TRANSLATION_MODELS.default;
    
    // Implementation would call translation API
    // For now, show placeholder
    showToast('Translation feature coming soon', 'info');
}

// ============================================
// SECTION 12: WEB SEARCH FUNCTIONS
// ============================================

/**
 * Search web with multiple engines
 * @param {string} query - Search query
 * @returns {Promise<string>} - JSON string of results
 */
async function searchWeb(query) {
    let limit = 5;
    if (state.mode === 'research') limit = 15;
    else if (state.mode === 'search') limit = 20;
    
    const encodedQuery = encodeURIComponent(query);
    const corsProxy = 'https://corsproxy.io/?';
    
    const fetchJson = async (url) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        try {
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeout);
            if (!res.ok) return null;
            return await res.json();
        } catch (e) {
            return null;
        }
    };
    
    const querySearX = async (bang, site, sourceLabel) => {
        const instances = [
            'https://searx.be',
            'https://search.mdosch.de',
            'https://op.nx.is',
            'https://searx.work'
        ];
        
        let qParam = query;
        if (bang) qParam = `${bang} ${qParam}`;
        if (site) qParam = `${qParam} site:${site}`;
        
        const encodedQ = encodeURIComponent(qParam);
        
        for (const instance of instances) {
            let url = `${instance}/search?q=${encodedQ}&format=json&language=en`;
            let data = await fetchJson(url);
            if (!data) data = await fetchJson(`${corsProxy}${url}`);
            
            if (data && data.results) {
                return data.results.slice(0, limit).map(r => ({
                    title: r.title,
                    link: r.url,
                    snippet: r.content || r.title,
                    source: sourceLabel,
                    date: r.publishedDate ? new Date(r.publishedDate).toISOString().split('T')[0] : null
                }));
            }
        }
        return [];
    };
    
    const promises = [];
    const activeEngines = state.activeSearchEngines.length > 0
        ? state.activeSearchEngines
        : ['google', 'wikipedia', 'reddit'];
    
    activeEngines.forEach(key => {
        const config = SEARCH_ENGINES_CONFIG[key] || state.customSearchEngines.find(e => e.id === key);
        if (!config) return;
        
        if (config.type === 'api') {
            if (key === 'wikipedia') {
                promises.push(async () => {
                    const data = await fetchJson(
                        `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodedQuery}&limit=${limit}&namespace=0&format=json&origin=*`
                    );
                    if (data && data[1]) {
                        return data[1].map((title, i) => ({
                            title,
                            link: data[3][i],
                            snippet: `Wikipedia: ${title}`,
                            source: 'Wikipedia'
                        }));
                    }
                    return [];
                });
            } else if (key === 'reddit') {
                promises.push(async () => {
                    const data = await fetchJson(
                        `https://www.reddit.com/search.json?q=${encodedQuery}&limit=${limit}&sort=relevance`
                    );
                    if (data && data.data && data.data.children) {
                        return data.data.children.map(c => ({
                            title: c.data.title,
                            link: `https://www.reddit.com${c.data.permalink}`,
                            snippet: c.data.selftext?.substring(0, 150) || `r/${c.data.subreddit}`,
                            source: 'Reddit',
                            date: new Date(c.data.created_utc * 1000).toISOString().split('T')[0]
                        }));
                    }
                    return [];
                });
            }
        } else if (config.type === 'searx') {
            promises.push(() => querySearX(config.bang, config.site, config.name));
        }
    });
    
    const resultsNested = await Promise.all(promises.map(p => p().catch(() => [])));
    const flat = resultsNested.flat().filter(x => x && x.title && x.link);
    const unique = flat.filter((v, i, a) => a.findIndex(t => t.link === v.link) === i);
    
    state.lastSources = unique;
    return JSON.stringify(unique);
}

// ============================================
// SECTION 13: TOOL EXECUTION FUNCTIONS
// ============================================

/**
 * Execute tool command
 * @param {string} cmd - Command string
 * @returns {Promise<string>} - Result
 */
async function executeTool(cmd) {
    const firstColon = cmd.indexOf(':');
    const tool = cmd.substring(0, firstColon).trim();
    const arg = cmd.substring(firstColon + 1).trim();
    
    if (tool === 'SEARCH') {
        return `SEARCH RESULTS: ${await searchWeb(arg)}`;
    }
    
    if (tool === 'CALC') {
        try {
            const result = eval(arg.replace(/[^-()\d/*+.]/g, ''));
            return `CALC: ${result}`;
        } catch (e) {
            return 'CALC ERROR';
        }
    }
    
    if (tool === 'CODE') {
        if (!pyodide) return 'PYTHON ERROR: Pyodide not loaded';
        try {
            pyodide.runPython(`import sys\nfrom io import StringIO\nsys.stdout = StringIO()`);
            await pyodide.runPythonAsync(arg);
            const stdout = pyodide.runPython('sys.stdout.getvalue()');
            return `CODE OUTPUT:\n${stdout}`;
        } catch (e) {
            return `CODE ERROR: ${e.message}`;
        }
    }
    
    if (tool === 'CREATE_FILE') {
        try {
            const data = JSON.parse(arg);
            
            if (data.type === 'pdf') {
                if (!window.jspdf) return 'PDF Lib missing';
                const doc = new window.jspdf.jsPDF();
                doc.text(doc.splitTextToSize(data.content, 180), 10, 10);
                doc.save(`${data.filename || 'generated'}.pdf`);
                return `File ${data.filename}.pdf created.`;
            }
            
            if (data.type === 'txt') {
                saveAs(new Blob([data.content], { type: 'text/plain' }), `${data.filename || 'generated'}.txt`);
                return `File ${data.filename}.txt created.`;
            }
            
            if (data.type === 'xlsx' || data.type === 'excel') {
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.aoa_to_sheet(
                    Array.isArray(data.content) ? data.content : [[data.content]]
                );
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                XLSX.writeFile(wb, `${data.filename || 'generated'}.xlsx`);
                return `File ${data.filename}.xlsx created.`;
            }
            
            if (data.type === 'pptx' || data.type === 'slides') {
                const pres = new PptxGenJS();
                const slides = Array.isArray(data.content) ? data.content : [data.content];
                slides.forEach(txt => {
                    let slide = pres.addSlide();
                    slide.addText(txt, { x: 1, y: 1, w: '80%', fontSize: 18 });
                });
                pres.writeFile({ fileName: `${data.filename || 'generated'}.pptx` });
                return `File ${data.filename}.pptx created.`;
            }
            
            if (data.type === 'zip') {
                const zip = new JSZip();
                if (typeof data.content === 'object' && !Array.isArray(data.content)) {
                    Object.entries(data.content).forEach(([k, v]) => zip.file(k, v));
                } else {
                    zip.file('content.txt', data.content);
                }
                const blob = await zip.generateAsync({ type: 'blob' });
                saveAs(blob, `${data.filename || 'archive'}.zip`);
                return `File ${data.filename}.zip created.`;
            }
            
            if (data.type === 'docx' || data.type === 'word') {
                if (!window.docx) return 'Docx lib missing';
                const { Document, Packer, Paragraph, TextRun } = window.docx;
                const doc = new Document({
                    sections: [{
                        children: [new Paragraph({ children: [new TextRun(data.content)] })]
                    }]
                });
                const blob = await Packer.toBlob(doc);
                saveAs(blob, `${data.filename || 'generated'}.docx`);
                return `File ${data.filename}.docx created.`;
            }
        } catch (e) {
            return `CREATE_FILE ERROR: ${e.message}`;
        }
    }
    
    return 'UNKNOWN TOOL';
}

// ============================================
// SECTION 14: DISCOVERY FEED FUNCTIONS
// ============================================

/**
 * Render discovery feed for search mode
 */
async function renderDiscovery() {
    const container = document.getElementById('discoveryFeed');
    if (!container || container.children.length > 0) return;
    
    container.innerHTML = `
        <div class="col-span-full text-center text-xs text-[var(--text-secondary)]">
            <i class="fas fa-circle-notch animate-spin"></i> Discovering...
        </div>
    `;
    
    try {
        const resultsJson = await searchWeb('latest technology news world');
        const results = JSON.parse(resultsJson);
        
        if (results && results.length > 0) {
            container.innerHTML = results.slice(0, 8).map(item => `
                <a href="${item.link}" target="_blank" class="discovery-card">
                    <div class="discovery-source">
                        <img src="https://www.google.com/s2/favicons?domain=${new URL(item.link).hostname}"
                            class="w-3 h-3" onerror="this.style.display='none'">
                        <span>${item.source || new URL(item.link).hostname}</span>
                    </div>
                    <div class="discovery-title">${escapeHtml(item.title)}</div>
                    <div class="discovery-snippet">${escapeHtml(item.snippet)}</div>
                </a>
            `).join('');
        } else {
            container.innerHTML = `
                <div class="col-span-full text-center text-xs text-[var(--text-secondary)]">
                    No news found.
                </div>
            `;
        }
    } catch (e) {
        container.innerHTML = '';
    }
}

// ============================================
// SECTION 15: PROMPT REFINER FUNCTIONS
// ============================================

/**
 * Update prompt refiner preview panel
 */
function updatePromptRefinerPreview() {
    const panel = document.getElementById('promptRefinerPanel');
    const originalEl = document.getElementById('promptRefinerOriginal');
    const refinedEl = document.getElementById('promptRefinerRefined');
    const modeEl = document.getElementById('promptRefinerMode');
    const modelsEl = document.getElementById('promptRefinerModels');
    const stageEl = document.getElementById('promptRefinerStage');
    
    if (!panel || !state.promptRefinerEnabled) return;
    
    const input = document.getElementById('userInput');
    if (!input) return;
    
    const original = input.value || 'Type your query...';
    
    // Simple refinement logic (can be enhanced with AI)
    let refined = original;
    
    // Add context based on mode
    if (state.mode === 'task') {
        refined = `Task: ${original}\nRequirements:\n1. Complete, working solution\n2. No placeholders\n3. Modern best practices`;
    } else if (state.mode === 'research') {
        refined = `Research Query: ${original}\nProvide:\n1. Multiple perspectives\n2. Citations\n3. Confidence levels`;
    } else if (state.mode === 'search') {
        refined = `Search: ${original}\nInclude:\n1. Recent sources\n2. Inline citations [1], [2]\n3. Summary`;
    }
    
    if (originalEl) originalEl.textContent = original;
    if (refinedEl) refinedEl.textContent = refined;
    if (modeEl) modeEl.textContent = `Mode: ${state.mode.charAt(0).toUpperCase() + state.mode.slice(1)}`;
    if (modelsEl) modelsEl.textContent = `Models: ${state.selectedModels.length} selected`;
    if (stageEl) stageEl.textContent = `Stage: ${state.stageSelector === 'none' ? 'Parallel' : `Aggregation (${state.stageSelector}-step)`}`;
}

// ============================================
// SECTION 16: SAFETY CHECK FUNCTIONS
// ============================================

/**
 * Check content against safety models
 * @param {string} content - Content to check
 * @returns {Promise<{safe: boolean, reasons: string[]}>}
 */
async function checkSafety(content) {
    const reasons = [];
    let safe = true;
    
    // Check enabled safety models
    if (state.safetyModels.graniteGuard) {
        // Would call IBM Granite Guardian API
        // Placeholder for implementation
    }
    
    if (state.safetyModels.shieldGemma) {
        // Would call Google ShieldGemma API
        // Placeholder for implementation
    }
    
    if (state.safetyModels.llamaGuard) {
        // Would call Meta Llama Guard API
        // Placeholder for implementation
    }
    
    // Constitutional safety checks
    if (state.features.constitutionalSafety) {
        const harmfulPatterns = [
            /how to.*hack/i,
            /how to.*steal/i,
            /how to.*kill/i,
            /bomb.*make/i
        ];
        
        harmfulPatterns.forEach(pattern => {
            if (pattern.test(content)) {
                safe = false;
                reasons.push('Potentially harmful content detected');
            }
        });
    }
    
    return { safe, reasons };
}

// ============================================
// SECTION 17: EXPORT FUNCTIONS
// ============================================

/**
 * Copy to clipboard
 */
function copyToClipboard() {
    const content = window.lastAnswer || '';
    if (content) {
        navigator.clipboard.writeText(content).then(() => showToast('Copied!'));
    }
}

/**
 * Download as Markdown
 */
function downloadMarkdown() {
    const content = window.lastAnswer || '';
    saveAs(new Blob([content], { type: 'text/markdown' }), 'sahu-chat.md');
}

/**
 * Download as TXT
 */
function downloadTxt() {
    const content = window.lastAnswer || '';
    saveAs(new Blob([content], { type: 'text/plain' }), 'sahu-answer.txt');
}

/**
 * Download as PDF
 */
function downloadPdf() {
    if (!window.jspdf) {
        showToast('PDF library not loaded', 'error');
        return;
    }
    
    try {
        const doc = new window.jspdf.jsPDF();
        const lines = doc.splitTextToSize(window.lastAnswer || '', 180);
        doc.text(lines, 15, 20);
        doc.save('sahu-answer.pdf');
    } catch (e) {
        showToast('PDF Export Error', 'error');
    }
}

/**
 * Download as DOCX
 */
function downloadDocx() {
    if (!window.docx) {
        showToast('DOCX library not loaded', 'error');
        return;
    }
    
    try {
        const { Document, Packer, Paragraph, TextRun } = window.docx;
        const doc = new Document({
            sections: [{
                children: [new Paragraph({
                    children: [new TextRun(window.lastAnswer || '')]
                })]
            }]
        });
        Packer.toBlob(doc).then(blob => saveAs(blob, 'sahu-answer.docx'));
    } catch (e) {
        showToast('DOCX Export Error', 'error');
    }
}

/**
 * Open preview window
 */
function openPreview() {
    const content = window.lastAnswer || '';
    const w = window.open();
    if (w) {
        w.document.write(`
            <html>
                <head>
                    <title>SahuAI Preview</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
                    </style>
                </head>
                <body>${formatMarkdown(content)}</body>
            </html>
        `);
    }
}

// ============================================
// SECTION 18: MARKDOWN FORMATTING
// ============================================

/**
 * Format markdown text with citations and code blocks
 * @param {string} text - Markdown text
 * @returns {string} - Formatted HTML
 */
function formatMarkdown(text) {
    if (!text) return '';
    
    // Citation handling
    text = text.replace(/\[(\d+)\]/g, (match, id) => {
        const src = state.lastSources[parseInt(id) - 1];
        if (src) {
            return `
                <a href="${src.link}" target="_blank" class="citation relative">
                    [${id}]
                    <div class="citation-tooltip">
                        <div class="citation-tooltip-title">${escapeHtml(src.title)}</div>
                        <div class="citation-tooltip-snippet">${escapeHtml(src.snippet)}</div>
                        <div class="citation-tooltip-link">${src.link}</div>
                    </div>
                </a>
            `;
        }
        return match;
    });
    
    // Code block handling with artifact support
    const artifactRegex = /```(\w+)?\n([\s\S]*?)```/g;
    text = text.replace(artifactRegex, (match, lang, code) => {
        lang = lang || 'text';
        const escapedCode = escapeHtml(code);
        const id = 'code-' + Math.random().toString(36).substr(2, 9);
        
        let actions = `
            <button onclick="navigator.clipboard.writeText(document.getElementById('${id}').innerText).then(()=>showToast('Code copied'))" class="artifact-action">
                <i class="fas fa-copy"></i> Copy
            </button>
        `;
        
        if (lang === 'python') {
            actions += `
                <button onclick="executeTool('CODE:${code.replace(/"/g, '\\"').replace(/\n/g, '\\n')}')" class="artifact-action">
                    <i class="fas fa-play"></i> Run
                </button>
            `;
        }
        
        if (lang === 'html' || state.mode === 'task') {
            actions += `
                <button onclick="openArtifact(document.getElementById('${id}').innerText, '${lang}')" class="artifact-action">
                    <i class="fas fa-desktop"></i> Open Canvas
                </button>
            `;
        }
        
        return `
            <div class="artifact-container">
                <div class="artifact-header">
                    <span>${lang.toUpperCase()}</span>
                    <div class="artifact-actions">${actions}</div>
                </div>
                <div class="artifact-content">
                    <pre><code id="${id}" class="language-${lang}">${escapedCode}</code></pre>
                </div>
            </div>
        `;
    });
    
    // Inline code
    text = text.replace(/`([^`]+)`/g,
        '<code class="bg-[var(--bg-tertiary)] px-1 py-0.5 rounded text-xs">$1</code>');
    
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Line breaks
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// ============================================
// CONTINUED IN NEXT MESSAGE (API Calls & Core AI)
// ============================================

// ============================================
// SECTION 19: CORE API CALL FUNCTION
// ============================================

/**
 * Call model with fallback support
 * @param {string} providerKey - Provider key
 * @param {string} modelId - Model ID
 * @param {Array} messages - Message array
 * @param {number} retryCount - Retry count
 * @param {Function} onToken - Token callback
 * @returns {Promise<Object>} - Response object
 */
async function callModelWithFallback(providerKey, modelId, messages, retryCount = 0, onToken = null) {
    // Get provider config (built-in or custom)
    let provider = PROVIDERS[providerKey];
    if (!provider) {
        provider = state.customProviders.find(p => p.id === providerKey);
    }
    
    if (!provider) {
        throw new Error(`Unknown provider: ${providerKey}`);
    }
    
    // Get API key
    let apiKey = localStorage.getItem(provider.keyName);
    
    // Fallback key for Saksham Intelligence native models
    if (providerKey === 'nvidia' && !apiKey) {
        apiKey = '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';
    }
    
    if (!apiKey) {
        throw new Error(`No API key for ${provider.name}`);
    }
    
    // Determine streaming support
    let useRealStreaming = true;
    if (providerKey !== 'nvidia' && providerKey !== 'gemini') {
        useRealStreaming = false;
    }
    
    // Build headers
    const headers = { 'Content-Type': 'application/json' };
    if (providerKey === 'gemini') {
        headers['Authorization'] = `Bearer ${apiKey}`;
    } else {
        headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    if (providerKey === 'openrouter') {
        headers['HTTP-Referer'] = window.location.href;
        headers['X-Title'] = 'SAHU 2.0';
    }
    
    // Clone messages
    let finalMessages = JSON.parse(JSON.stringify(messages));
    
    // Get model config
    const modelConfig = MODEL_CONFIGS[modelId] || {};
    
    // Get human-readable model name
    let modelHumanName = modelId;
    if (provider.models) {
        const entry = Object.entries(provider.models).find(([key, val]) => val === modelId);
        if (entry) modelHumanName = entry[0];
    }
    
    // Build system prompt
    let sysPrompt = `User Info: ${state.customInstructions.user}\nResponse Style: ${state.customInstructions.resp}`;
    sysPrompt += `\nIDENTITY INSTRUCTION: You are ${modelHumanName}. If asked about your identity, state your original name (${modelHumanName}) and your original creator company. Then, ALWAYS add 'Hosted by Saksham Intelligence'. Do not claim to be created by Saksham Intelligence, only hosted by them.`;
    
    // Language instruction
    const selectedLang = LANGUAGES.find(l => l.code === state.language)?.name || 'English';
    sysPrompt += `\nLANGUAGE INSTRUCTION: You must respond in ${selectedLang} language.`;
    
    // DeepThink prompt injection
    const deepThinkActive = state.deepThinkEnabled;
    if (deepThinkActive) {
        const budget = state.thinkingBudget;
        const deepThinkPrompt = `
\n\n========================================
You are operating in DeepThink Mode.
All reasoning must be shown explicitly.
Do not hide intermediate steps.

========================================
USER SETTINGS
========================================
THINKING_BUDGET = ${budget.toUpperCase()}

Complexity:
- fast → medium reasoning
- balanced → high reasoning
- ultra → x-high reasoning

========================================
DEEPTHINK PROCESS
========================================
STEP 1 — Clarify the Problem
- Restate clearly
- Identify constraints

STEP 2 — Decompose
- Break into logical components
- Identify dependencies

STEP 3 — Multi-Path Reasoning
- Explore multiple solution paths
- Compare strengths and weaknesses

STEP 4 — Assumption Analysis
- List assumptions
- Test whether they hold

STEP 5 — Counter-Argument
- Attempt to disprove your reasoning
- Stress-test logic

STEP 6 — Edge Case Examination
- Identify extreme or boundary cases
- Test solution stability

STEP 7 — Final Synthesis
- Rebuild strongest logical answer

========================================
MODE BEHAVIOR
========================================
${THINKING_TEMPLATES[budget]}

========================================
OUTPUT FORMAT
========================================
1. Problem Restatement
2. Step-by-Step Reasoning
3. Alternative Path(s)
4. Critical Evaluation
5. Final Answer
${budget === 'ultra' ? 'If ULTRA:\n6. Confidence Score\n7. Remaining DOUBTS' : ''}

CRITICAL INSTRUCTION: Output your internal monologue enclosed in <think>tags based on the process above. Then provide the final response.
`;
        sysPrompt += deepThinkPrompt;
    }
    
    // Dynamic max tokens
    let dynamicMaxTokens = 9000;
    if (state.mode === 'task' || state.mode === 'research' || state.mode === 'search') {
        dynamicMaxTokens = 30000;
        sysPrompt += "\nMODE: HIGH CAPACITY. Generating extended output.";
    }
    
    if (modelConfig.max_tokens) {
        dynamicMaxTokens = modelConfig.max_tokens;
    }
    
    // Mode-specific prompts
    if (state.mode === 'task') {
        if (state.taskType === 'vibe') {
            sysPrompt += "\nMODE: TASK/CODE (VIBE CODE). Protocol: 1. PLAN (Think) 2. GENERATE FULL CODE (HTML/CSS/JS in one block or React) 3. EXPLAIN. Focus on modern aesthetics, responsiveness, and robustness. Use ```html for HTML/JS/CSS combos to trigger preview.";
        } else if (state.taskType === 'agentic') {
            sysPrompt += "\nMODE: TASK/CODE (AGENTIC CODE). Protocol: AUTONOMOUS. Build complete, self-contained solutions. No placeholders. Self-correct if needed. Use ```html for UI components.";
        } else if (state.taskType === 'file_creation') {
            sysPrompt += "\nMODE: FILE CREATION. You are a tool-using agent capable of creating files. To create a file, you MUST output a tool call block like this: `CREATE_FILE: {\"type\": \"pdf|xlsx|pptx|txt|docx|zip\", \"filename\": \"name\", \"content\": \"...\"}`. For Excel/PPTX, provide array data. For Zip, provide object of filenames. Wait for user confirmation.";
        }
    } else if (state.mode === 'research') {
        sysPrompt += "\nMODE: DEEP RESEARCH. Protocol: Analyze provided search results deeply. Synthesize multiple sources. Be exhaustive and detailed.";
    } else if (state.mode === 'search') {
        sysPrompt += "\nMODE: SAHUAI SEARCH (Perplexity Style). Answer concisely but comprehensively based on the provided search results. You MUST cite sources using [1], [2] notation inline with the text where the information is used. Do NOT create a separate reference list at the end, just use inline citations.";
    } else {
        sysPrompt += "\nMODE: STANDARD. Use available search results to answer accurately. Cite sources if used.";
    }
    
    // File attachment handling
    if (state.uploadedFileContent && finalMessages[0]?.role !== 'system') {
        sysPrompt += `\n\n[ATTACHED FILE CONTENT]:\n${state.uploadedFileContent}\n[END FILE CONTENT]\nAnalyze this file context if relevant.`;
    }
    
    // Web search context injection
    const lastUserMsg = finalMessages[finalMessages.length - 1];
    if (lastUserMsg?.role === 'user' && lastUserMsg.content?.includes('[MANDATORY WEB SEARCH CONTEXT]')) {
        const splitContent = lastUserMsg.content.split('[MANDATORY WEB SEARCH CONTEXT]:');
        if (splitContent.length > 1) {
            const searchData = splitContent[1].split('[END CONTEXT]')[0];
            sysPrompt += `\n\n=== MANDATORY SEARCH RESULTS (${new Date().toISOString().split('T')[0]}) ===\n${searchData}\n=== END SEARCH RESULTS ===\nINSTRUCTION: You MUST use the search results above to answer. Cite specific sources. If the answer is not in the results, state that. Do NOT ignore this data.`;
            lastUserMsg.content = splitContent[0].trim();
        }
    }
    
    // Inject system prompt
    if (finalMessages[0]?.role === 'system' && !modelConfig.noSystemRole) {
        finalMessages[0].content += `\n${sysPrompt}`;
    } else if (!modelConfig.noSystemRole && finalMessages[0]?.role !== 'system') {
        finalMessages.unshift({ role: 'system', content: sysPrompt });
    }
    
    // Build request body
    let requestBody = {
        model: modelId,
        messages: finalMessages,
        max_tokens: dynamicMaxTokens,
        temperature: state.temperature,
        stream: !modelConfig.noStream && useRealStreaming
    };
    
    if (providerKey === 'mistral') {
        requestBody = { agent_id: modelId, messages: finalMessages };
    }
    if (providerKey === 'nvidia') {
        requestBody.temperature = state.temperature;
        requestBody.top_p = 0.95;
    }
    
    // Build URL with CORS proxy if needed
    let url = provider.endpoint;
    if (providerKey === 'nvidia') {
        if (modelId === 'nvidia/cosmos-reason2-8b') {
            url = 'https://thingproxy.freeboard.io/fetch/' + provider.endpoint;
        } else {
            url = 'https://corsproxy.io/?' + encodeURIComponent(provider.endpoint);
        }
    }
    if (providerKey === 'ollama') {
        url = 'https://thingproxy.freeboard.io/fetch/' + provider.endpoint;
    }
    
    // Track metrics
    const controller = new AbortController();
    const startTime = Date.now();
    let currentTokenCount = 0;
    
    const updateMetrics = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const speed = elapsed > 0 ? (currentTokenCount / elapsed).toFixed(1) : 0;
        const timeStr = elapsed < 60 ? elapsed.toFixed(1) + 's' : (elapsed / 60).toFixed(1) + 'm';
        
        const timeEl = document.getElementById('metricTime');
        const speedEl = document.getElementById('metricSpeed');
        if (timeEl) timeEl.textContent = timeStr;
        if (speedEl) speedEl.textContent = speed + ' t/s';
    };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });
        
        if (!response.ok) {
            throw new Error(`${response.status}: ${await response.text()}`);
        }
        
        // Handle streaming response
        if (response.body && requestBody.stream) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let fullText = "";
            let thinkingText = "";
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.trim().startsWith(' ')) {
                        const jsonStr = line.replace(' ', '').trim();
                        if (jsonStr === '[DONE]') break;
                        
                        try {
                            const json = JSON.parse(jsonStr);
                            const contentChunk = json.choices?.[0]?.delta?.content || "";
                            const thinkingChunk = json.choices?.[0]?.delta?.reasoning_content || "";
                            
                            fullText += contentChunk;
                            thinkingText += thinkingChunk;
                            
                            if (contentChunk || thinkingChunk) {
                                currentTokenCount++;
                                updateMetrics();
                            }
                            
                            if (onToken) onToken(fullText, thinkingText, contentChunk);
                        } catch (e) {
                            // Skip malformed JSON lines
                        }
                    }
                }
            }
            
            return { content: fullText, thinking: thinkingText, provider: providerKey };
        } else {
            // Handle non-streaming response
            const data = await response.json();
            let content = data.choices?.[0]?.message?.content || '';
            let thinking = data.choices?.[0]?.message?.reasoning_content || '';
            
            // Extract thinking blocks
            const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
            if (thinkMatch) {
                thinking = thinkMatch[1];
                content = content.replace(/<think>[\s\S]*?<\/think>/, '').trim();
            }
            
            // Simulate streaming for UI
            if (onToken && content) {
                if (thinking) onToken("", thinking, "");
                
                const chunks = content.split(/(\s+)/);
                let currentAcc = "";
                
                for (const chunk of chunks) {
                    currentAcc += chunk;
                    onToken(currentAcc, thinking, chunk);
                    currentTokenCount++;
                    updateMetrics();
                    await new Promise(r => setTimeout(r, 2));
                }
            }
            
            return { content, thinking, provider: providerKey };
        }
    } catch (error) {
        // Auto-fallback logic
        if (state.autoFallback && retryCount < 1) {
            const fallback = state.activeProviders.find(p =>
                p !== providerKey && localStorage.getItem(PROVIDERS[p]?.keyName)
            );
            if (fallback) {
                const fallbackProvider = PROVIDERS[fallback];
                if (fallbackProvider) {
                    const firstModel = Object.values(fallbackProvider.models)[0];
                    return {
                        ...await callModelWithFallback(fallback, firstModel, messages, retryCount + 1, onToken),
                        fallback: true
                    };
                }
            }
        }
        throw error;
    }
}

// ============================================
// SECTION 20: DEBATE MODE IMPLEMENTATION
// ============================================

/**
 * Run debate mode aggregation (Standard/Task modes)
 * @param {string} content - User content
 * @param {HTMLElement} container - Messages container
 * @param {string} chatId - Chat ID
 */
async function runDebateMode(content, container, chatId) {
    const activeModels = state.selectedModels.filter(m =>
        state.activeProviders.includes(m.provider)
    );
    
    if (activeModels.length === 0) return;
    
    // Stage 1: Initial responses + Pros/Cons (neutral framing)
    const stage1Id = `debate-stage1-${Date.now()}`;
    container.innerHTML += `
        <div class="research-stage active" id="${stage1Id}">
            <div class="research-header">
                <span class="flex items-center gap-2">
                    <i class="fas fa-comments text-blue-500"></i>
                    Stage 1: Initial Responses + Balanced Analysis
                </span>
                <span class="text-[10px] bg-[var(--bg-tertiary)] px-2 py-1 rounded">${activeModels.length} Models</span>
            </div>
            <div class="research-content" style="display:block;">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="stage1-grid"></div>
            </div>
        </div>
    `;
    
    const stage1Grid = document.getElementById('stage1-grid');
    const stage1Results = [];
    
    // Run all models in parallel for Stage 1
    await Promise.all(activeModels.map(async (model, idx) => {
        if (state.currentChatId !== chatId) return;
        
        const divId = `s1-${idx}`;
        stage1Grid.innerHTML += `
            <div class="expert-card thinking rounded-xl p-3 mb-2" id="${divId}">
                <div class="flex items-center gap-2 mb-2">
                    <span class="text-xl">${PROVIDERS[model.provider]?.icon || '🤖'}</span>
                    <div class="flex-1 min-w-0">
                        <div class="font-medium text-sm truncate">${model.modelKey}</div>
                        <div class="text-[10px] text-[var(--text-secondary)]">${PROVIDERS[model.provider]?.name || 'Custom'}</div>
                    </div>
                    <div class="typing-indicator flex gap-1">
                        <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                        <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                        <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                    </div>
                </div>
                <div class="text-xs text-[var(--text-secondary)] mb-1" id="status-${divId}">Thinking...</div>
                <div class="text-xs text-gray-500 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto" id="stream-${divId}"></div>
            </div>
        `;
        
        try {
            // Add debate mode prompt for balanced analysis
            const debatePrompt = `${content}\n\n[DEBATE MODE - STAGE 1]\nProvide your initial response, then include a balanced Pros/Cons analysis. Stay neutral and objective.`;
            
            const onToken = (text, thinking, chunk) => {
                if (state.currentChatId !== chatId) return;
                const el = document.getElementById(`stream-${divId}`);
                if (el) {
                    el.textContent += chunk;
                    el.scrollTop = el.scrollHeight;
                }
                const st = document.getElementById(`status-${divId}`);
                if (st) st.textContent = thinking ? "Thinking..." : "Generating...";
            };
            
            const res = await callModelWithFallback(model.provider, model.modelId,
                [{ role: 'user', content: debatePrompt }], 0, onToken);
            
            if (state.currentChatId !== chatId) return;
            
            stage1Results.push(res.content);
            
            // Update card UI
            const card = document.getElementById(divId);
            if (card) {
                card.className = "expert-card complete rounded-xl p-3 mb-2";
                card.innerHTML = `
                    <div class="flex items-center gap-2 mb-2">
                        <span>${PROVIDERS[model.provider]?.icon || '🤖'}</span>
                        <div class="flex-1 min-w-0">
                            <div class="font-medium text-sm truncate">${model.modelKey}</div>
                            <div class="text-[10px] text-[var(--text-secondary)]">${PROVIDERS[model.provider]?.name || 'Custom'}</div>
                        </div>
                        <i class="fas fa-check-circle text-green-500"></i>
                    </div>
                    ${res.thinking ? `
                        <div class="thinking-block">
                            <div class="thinking-header"><i class="fas fa-brain"></i> Thinking Process</div>
                            <div class="text-[var(--text-secondary)] text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">${escapeHtml(res.thinking)}</div>
                        </div>
                    ` : ''}
                    <div class="text-sm max-h-64 overflow-y-auto">${formatMarkdown(res.content)}</div>
                `;
            }
        } catch (e) {
            const card = document.getElementById(divId);
            if (card) {
                card.className = "expert-card error rounded-xl p-3 mb-2";
                card.innerHTML = `<div class="font-bold text-[10px] text-red-500">${model.modelKey} (Failed: ${e.message})</div>`;
            }
        }
    }));
    
    // Stage 2: Pros vs Cons dedicated analysis
    const stage2Id = `debate-stage2-${Date.now()}`;
    container.innerHTML += `
        <div class="research-stage active" id="${stage2Id}">
            <div class="research-header">
                <span class="flex items-center gap-2">
                    <i class="fas fa-balance-scale text-purple-500"></i>
                    Stage 2: Dedicated Pros vs Cons Analysis
                </span>
                <span class="text-[10px] bg-[var(--bg-tertiary)] px-2 py-1 rounded">Debate</span>
            </div>
            <div class="research-content" style="display:block;">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="stage2-grid"></div>
            </div>
        </div>
    `;
    
    const stage2Grid = document.getElementById('stage2-grid');
    const stage2Results = [];
    
    // Split models into Pros and Cons teams
    const prosModels = activeModels.slice(0, Math.ceil(activeModels.length / 2));
    const consModels = activeModels.slice(Math.ceil(activeModels.length / 2));
    
    // Run Pros team
    await Promise.all(prosModels.map(async (model, idx) => {
        if (state.currentChatId !== chatId) return;
        
        const divId = `s2-pros-${idx}`;
        stage2Grid.innerHTML += `
            <div class="expert-card thinking rounded-xl p-3 mb-2 border-l-4 border-green-500" id="${divId}">
                <div class="flex items-center gap-2 mb-2">
                    <span class="text-green-500"><i class="fas fa-thumbs-up"></i></span>
                    <div class="flex-1 min-w-0">
                        <div class="font-medium text-sm truncate">${model.modelKey} (Pros)</div>
                    </div>
                </div>
                <div class="text-xs text-[var(--text-secondary)] mb-1" id="status-${divId}">Analyzing benefits...</div>
                <div class="text-xs text-gray-500 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto" id="stream-${divId}"></div>
            </div>
        `;
        
        try {
            const prosPrompt = `${content}\n\n[DEBATE MODE - STAGE 2: PROS]\nBased on the initial responses, provide a comprehensive analysis of the BENEFITS, ADVANTAGES, and POSITIVE aspects. Be thorough and evidence-based.`;
            
            const onToken = (text, thinking, chunk) => {
                if (state.currentChatId !== chatId) return;
                const el = document.getElementById(`stream-${divId}`);
                if (el) {
                    el.textContent += chunk;
                    el.scrollTop = el.scrollHeight;
                }
            };
            
            const res = await callModelWithFallback(model.provider, model.modelId,
                [{ role: 'user', content: prosPrompt }], 0, onToken);
            
            if (state.currentChatId !== chatId) return;
            
            stage2Results.push(`### PROS (${model.modelKey})\n${res.content}`);
            
            const card = document.getElementById(divId);
            if (card) {
                card.className = "expert-card complete rounded-xl p-3 mb-2 border-l-4 border-green-500";
                card.innerHTML = `
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-green-500"><i class="fas fa-thumbs-up"></i></span>
                        <div class="flex-1 min-w-0">
                            <div class="font-medium text-sm truncate">${model.modelKey} (Pros)</div>
                        </div>
                        <i class="fas fa-check-circle text-green-500"></i>
                    </div>
                    <div class="text-sm max-h-64 overflow-y-auto">${formatMarkdown(res.content)}</div>
                `;
            }
        } catch (e) {
            // Handle error silently for debate mode
        }
    }));
    
    // Run Cons team
    await Promise.all(consModels.map(async (model, idx) => {
        if (state.currentChatId !== chatId) return;
        
        const divId = `s2-cons-${idx}`;
        stage2Grid.innerHTML += `
            <div class="expert-card thinking rounded-xl p-3 mb-2 border-l-4 border-red-500" id="${divId}">
                <div class="flex items-center gap-2 mb-2">
                    <span class="text-red-500"><i class="fas fa-thumbs-down"></i></span>
                    <div class="flex-1 min-w-0">
                        <div class="font-medium text-sm truncate">${model.modelKey} (Cons)</div>
                    </div>
                </div>
                <div class="text-xs text-[var(--text-secondary)] mb-1" id="status-${divId}">Analyzing drawbacks...</div>
                <div class="text-xs text-gray-500 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto" id="stream-${divId}"></div>
            </div>
        `;
        
        try {
            const consPrompt = `${content}\n\n[DEBATE MODE - STAGE 2: CONS]\nBased on the initial responses, provide a comprehensive analysis of the DRAWBACKS, RISKS, and NEGATIVE aspects. Be thorough and evidence-based.`;
            
            const onToken = (text, thinking, chunk) => {
                if (state.currentChatId !== chatId) return;
                const el = document.getElementById(`stream-${divId}`);
                if (el) {
                    el.textContent += chunk;
                    el.scrollTop = el.scrollHeight;
                }
            };
            
            const res = await callModelWithFallback(model.provider, model.modelId,
                [{ role: 'user', content: consPrompt }], 0, onToken);
            
            if (state.currentChatId !== chatId) return;
            
            stage2Results.push(`### CONS (${model.modelKey})\n${res.content}`);
            
            const card = document.getElementById(divId);
            if (card) {
                card.className = "expert-card complete rounded-xl p-3 mb-2 border-l-4 border-red-500";
                card.innerHTML = `
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-red-500"><i class="fas fa-thumbs-down"></i></span>
                        <div class="flex-1 min-w-0">
                            <div class="font-medium text-sm truncate">${model.modelKey} (Cons)</div>
                        </div>
                        <i class="fas fa-check-circle text-green-500"></i>
                    </div>
                    <div class="text-sm max-h-64 overflow-y-auto">${formatMarkdown(res.content)}</div>
                `;
            }
        } catch (e) {
            // Handle error silently
        }
    }));
    
    // Stage 3: Final synthesis (current system behavior)
    const stage3Id = `debate-stage3-${Date.now()}`;
    container.innerHTML += `
        <div class="aggregator-response stage-3 rounded-2xl p-4" id="${stage3Id}">
            <div class="flex items-center gap-3 mb-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-green-500">3</div>
                <div>
                    <span class="font-semibold text-sm">Stage 3: Final Synthesis</span>
                    <p class="text-xs text-[var(--text-secondary)]">Consensus & Conclusion</p>
                </div>
            </div>
            <div class="text-sm whitespace-pre-wrap" id="stage3-content">Synthesizing debate results...</div>
        </div>
    `;
    
    try {
        // Get aggregator model
        const aggModel = activeModels.find(m => m.stage === '3') || activeModels[0];
        if (!aggModel) return;
        
        const synthesisPrompt = `You are the Final Aggregator for a Debate Mode session.

INPUTS:
### Stage 1 Initial Responses:
${stage1Results.slice(0, 3).join('\n---\n')}

### Stage 2 Pros/Cons Analysis:
${stage2Results.join('\n\n')}

TASK: Synthesize these inputs into a final, balanced answer.
- Acknowledge valid points from both sides
- Provide a nuanced conclusion
- Flag any remaining uncertainties
- Cite sources if applicable

Output format:
1. Executive Summary
2. Key Agreements
3. Key Disagreements (resolved)
4. Final Recommendation
5. Confidence Level`;
        
        const onToken = (text, thinking, chunk) => {
            if (state.currentChatId !== chatId) return;
            const el = document.getElementById('stage3-content');
            if (el) el.textContent += chunk;
        };
        
        const res = await callModelWithFallback(aggModel.provider, aggModel.modelId,
            [{ role: 'user', content: synthesisPrompt }], 0, onToken);
        
        if (state.currentChatId !== chatId) return;
        
        // Save final answer
        window.lastAnswer = res.content;
        
        // Save to chat history
        const assistMsgObj = { role: 'assistant', content: res.content };
        state.messages.push(assistMsgObj);
        
        const currentChat = state.chatHistory.find(c => c.id === state.currentChatId);
        if (currentChat) {
            currentChat.messages.push(assistMsgObj);
        }
        localStorage.setItem('sahu_chat_history', JSON.stringify(state.chatHistory));
        
        // Update UI
        const stage3El = document.getElementById(stage3Id);
        if (stage3El) {
            stage3El.innerHTML = `
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-green-500">3</div>
                    <div class="flex-1">
                        <span class="font-semibold text-sm">Stage 3: Final Synthesis</span>
                        <p class="text-xs text-[var(--text-secondary)]">${aggModel.modelKey}</p>
                    </div>
                    <button onclick="togglePin('${escapeHtml(res.content.substring(0, 100))}')" class="text-[var(--text-secondary)] hover:text-yellow-500">
                        <i class="fas fa-thumbtack"></i>
                    </button>
                </div>
                ${res.thinking ? `
                    <div class="thinking-block">
                        <div class="thinking-header"><i class="fas fa-brain"></i> Thinking</div>
                        <div class="text-[var(--text-secondary)] text-xs whitespace-pre-wrap">${escapeHtml(res.thinking)}</div>
                    </div>
                ` : ''}
                <div class="prose max-w-none text-sm">${formatMarkdown(res.content)}</div>
            `;
        }
        
        // Add export buttons
        container.innerHTML += `
            <div class="export-buttons">
                <button class="export-btn" onclick="copyToClipboard()"><i class="fas fa-copy"></i><span>Copy</span></button>
                <button class="export-btn" onclick="downloadTxt()"><i class="fas fa-file-alt"></i><span>TXT</span></button>
                <button class="export-btn" onclick="downloadPdf()"><i class="fas fa-file-pdf"></i><span>PDF</span></button>
                <button class="export-btn" onclick="downloadDocx()"><i class="fas fa-file-word"></i><span>DOCX</span></button>
            </div>
        `;
        
    } catch (e) {
        console.error('Debate mode aggregation failed:', e);
        showToast('Debate synthesis failed', 'error');
    }
}

// ============================================
// SECTION 21: RESEARCH PIPELINE IMPLEMENTATION
// ============================================

/**
 * Run deep research pipeline (5 stages, 6 models for stages 1-3)
 * @param {string} originalContent - Original user query
 * @param {HTMLElement} container - Messages container
 * @param {string} chatId - Chat ID
 */
async function runDeepResearch(originalContent, container, chatId) {
    let aggregationContext = "";
    let stageOutputs = [];
    
    container.innerHTML += `
        <div class="mb-4 text-center text-[var(--accent)] font-bold animate-pulse">
            <i class="fas fa-microscope"></i> Initializing Deep Research Pipeline...
        </div>
    `;
    
    const getDefaultModel = () => {
        if (state.selectedModels.length > 0) return state.selectedModels[0];
        return { provider: 'nvidia', modelId: 'minimaxai/minimax-m2.5', modelKey: 'MiniMax M2.5' };
    };
    
    const activeModels = state.selectedModels.filter(m =>
        state.activeProviders.includes(m.provider)
    );
    
    // Phase 0: Initial consensus (if models available)
    if (activeModels.length > 0) {
        const phase0Id = `phase-0-${Date.now()}`;
        container.innerHTML += `
            <div class="research-stage active" id="${phase0Id}">
                <div class="research-header" onclick="toggleResearchStage('${phase0Id}')">
                    <span class="flex items-center gap-2">
                        <i class="fas fa-users text-blue-500"></i>
                        Phase 0: Initial Consensus (${activeModels.length} Models)
                    </span>
                    <span class="text-[10px] bg-[var(--bg-tertiary)] px-2 py-1 rounded">Mass Generation</span>
                </div>
                <div class="research-content" id="content-${phase0Id}" style="display:block;">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="grid-${phase0Id}"></div>
                </div>
            </div>
        `;
        
        const phase0Grid = document.getElementById(`grid-${phase0Id}`);
        const phase0Results = [];
        
        await Promise.all(activeModels.map(async (model, idx) => {
            if (state.currentChatId !== chatId) return;
            
            const divId = `p0-${idx}`;
            phase0Grid.innerHTML += `
                <div class="expert-card thinking rounded-xl p-3 mb-2" id="${divId}">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-xl">${PROVIDERS[model.provider]?.icon || '🤖'}</span>
                        <div class="flex-1 min-w-0">
                            <div class="font-medium text-sm truncate">${model.modelKey}</div>
                            <div class="text-[10px] text-[var(--text-secondary)]">${PROVIDERS[model.provider]?.name || 'Custom'}</div>
                        </div>
                        <div class="typing-indicator flex gap-1">
                            <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                            <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                            <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                        </div>
                    </div>
                    <div class="text-xs text-[var(--text-secondary)] mb-1" id="status-${divId}">Thinking...</div>
                    <div class="text-xs text-gray-500 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto" id="stream-${divId}"></div>
                </div>
            `;
            
            try {
                const onPhase0Token = (text, thinking, chunk) => {
                    if (state.currentChatId !== chatId) return;
                    const el = document.getElementById(`stream-${divId}`);
                    if (el) {
                        el.textContent += chunk;
                        el.scrollTop = el.scrollHeight;
                    }
                    const st = document.getElementById(`status-${divId}`);
                    if (st) st.textContent = thinking ? "Thinking..." : "Generating...";
                };
                
                const res = await callModelWithFallback(model.provider, model.modelId,
                    [{ role: 'user', content: originalContent }], 0, onPhase0Token);
                
                if (state.currentChatId !== chatId) return;
                
                phase0Results.push(res.content);
                
                const card = document.getElementById(divId);
                if (card) {
                    card.className = "expert-card complete rounded-xl p-3 mb-2";
                    card.innerHTML = `
                        <div class="flex items-center gap-2 mb-2">
                            <span>${PROVIDERS[model.provider]?.icon || '🤖'}</span>
                            <div class="flex-1 min-w-0">
                                <div class="font-medium text-sm truncate">${model.modelKey}</div>
                                <div class="text-[10px] text-[var(--text-secondary)]">${PROVIDERS[model.provider]?.name || 'Custom'}</div>
                            </div>
                            <i class="fas fa-check-circle text-green-500"></i>
                        </div>
                        ${res.thinking ? `
                            <div class="thinking-block">
                                <div class="thinking-header"><i class="fas fa-brain"></i> Thinking Process</div>
                                <div class="text-[var(--text-secondary)] text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">${escapeHtml(res.thinking)}</div>
                            </div>
                        ` : ''}
                        <div class="text-sm max-h-64 overflow-y-auto">${formatMarkdown(res.content)}</div>
                    `;
                }
            } catch (e) {
                const card = document.getElementById(divId);
                if (card) {
                    card.className = "expert-card error rounded-xl p-3 mb-2";
                    card.innerHTML = `<div class="font-bold text-[10px] text-red-500">${model.modelKey} (Failed: ${e.message})</div>`;
                }
            }
        }));
        
        if (phase0Results.length > 0) {
            aggregationContext = "Initial Insights from " + activeModels.length + " models:\n" +
                phase0Results.slice(0, 3).join('\n---\n') + "\n...";
        }
    }
    
    // Run research stages 1-5
    for (const stage of RESEARCH_STAGES) {
        if (state.currentChatId !== chatId) return;
        
        const stageId = `res-stage-${stage.id}-${Date.now()}`;
        const contentId = `res-content-${stageId}`;
        
        container.innerHTML += `
            <div class="research-stage active" id="${stageId}">
                <div class="research-header" onclick="toggleResearchStage('${stageId}')">
                    <span class="flex items-center gap-2">
                        <i class="fas fa-circle-notch animate-spin text-[var(--accent)]" id="spin-${stageId}"></i>
                        ${stage.name}
                    </span>
                    <span class="text-[10px] bg-[var(--bg-tertiary)] px-2 py-1 rounded">
                        ${stage.id === 'stage5' ? 'Super Master' : (stage.id <= 3 ? '6 Experts' : '5 Experts')}
                    </span>
                </div>
                <div class="research-content" id="${contentId}" style="display:block;">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="experts-${stageId}"></div>
                </div>
            </div>
        `;
        container.scrollTop = container.scrollHeight;
        
        const stageResults = [];
        const expertsContainer = document.getElementById(`experts-${stageId}`);
        
        if (stage.id !== 'stage5') {
            // Stages 1-4: Run expert models
            const numExperts = stage.id <= 3 ? 6 : 5; // 6 for stages 1-3, 5 for stage 4
            
            await Promise.all(stage.experts.slice(0, numExperts).map(async (expertRole, idx) => {
                if (state.currentChatId !== chatId) return;
                
                // Get model for this expert role
                let expertModel = getDefaultModel();
                const configVal = state.researchConfig[`${stage.id}_${idx}`];
                if (configVal) {
                    const [p, m] = configVal.split('|');
                    expertModel = { provider: p, modelId: m, modelKey: m };
                }
                
                const expertDivId = `exp-${stageId}-${idx}`;
                expertsContainer.innerHTML += `
                    <div class="expert-card thinking rounded-xl p-3 mb-2" id="${expertDivId}">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-xl">${PROVIDERS[expertModel.provider]?.icon || '🤖'}</span>
                            <div class="flex-1 min-w-0">
                                <div class="font-medium text-sm text-[var(--accent)]">${expertRole}</div>
                                <div class="text-[10px] text-[var(--text-secondary)]">${expertModel.modelKey}</div>
                            </div>
                            <div class="typing-indicator flex gap-1">
                                <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                                <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                                <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                            </div>
                        </div>
                        <div class="text-xs text-[var(--text-secondary)] mb-1" id="status-${expertDivId}">Thinking...</div>
                        <div class="text-xs text-gray-500 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto" id="stream-${expertDivId}"></div>
                    </div>
                `;
                
                // Build prompt with role-specific instructions
                let rolePrompt = "";
                if (stage.id <= 3 && idx === 5) {
                    // 6th model: Pros/Cons/Neutral rotation
                    if (stage.id === 1) {
                        rolePrompt = "Focus on identifying PROS, benefits, and positive aspects.";
                    } else if (stage.id === 2) {
                        rolePrompt = "Focus on identifying CONS, risks, and negative aspects.";
                    } else {
                        rolePrompt = "Provide a NEUTRAL, balanced analysis without bias.";
                    }
                }
                
                const prompt = `
                    You are participating in a Deep Research Pipeline.
                    ROLE: ${expertRole}
                    STAGE: ${stage.name}
                    ${rolePrompt ? `\nSPECIAL INSTRUCTION: ${rolePrompt}` : ''}
                    
                    CONTEXT SO FAR:
                    ${aggregationContext ? aggregationContext : "Initial Problem Statement: " + originalContent}
                    
                    TASK: Provide your specialized analysis based on your role. Be critical and thorough.
                `;
                
                try {
                    const onExpertToken = (text, thinking, chunk) => {
                        if (state.currentChatId !== chatId) return;
                        const el = document.getElementById(`stream-${expertDivId}`);
                        if (el) {
                            el.textContent += chunk;
                            el.scrollTop = el.scrollHeight;
                        }
                        const st = document.getElementById(`status-${expertDivId}`);
                        if (st) st.textContent = thinking ? "Thinking..." : "Generating...";
                    };
                    
                    const res = await callModelWithFallback(expertModel.provider, expertModel.modelId,
                        [{ role: 'user', content: prompt }], 0, onExpertToken);
                    
                    if (state.currentChatId !== chatId) return;
                    
                    stageResults.push(`### ${expertRole}\n${res.content}`);
                    
                    const card = document.getElementById(expertDivId);
                    if (card) {
                        card.className = "expert-card complete rounded-xl p-3 mb-2";
                        card.innerHTML = `
                            <div class="flex items-center gap-2 mb-2">
                                <span>${PROVIDERS[expertModel.provider]?.icon || '🤖'}</span>
                                <div class="flex-1 min-w-0">
                                    <div class="font-medium text-sm text-[var(--accent)]">${expertRole}</div>
                                    <div class="text-[10px] text-[var(--text-secondary)]">${expertModel.modelKey}</div>
                                </div>
                                <i class="fas fa-check-circle text-green-500"></i>
                            </div>
                            ${res.thinking ? `
                                <div class="thinking-block">
                                    <div class="thinking-header"><i class="fas fa-brain"></i> Thinking Process</div>
                                    <div class="text-[var(--text-secondary)] text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">${escapeHtml(res.thinking)}</div>
                                </div>
                            ` : ''}
                            <div class="text-sm max-h-64 overflow-y-auto">${formatMarkdown(res.content)}</div>
                        `;
                    }
                } catch (e) {
                    stageResults.push(`### ${expertRole}\n[Failed: ${e.message}]`);
                    const card = document.getElementById(expertDivId);
                    if (card) {
                        card.className = "expert-card error rounded-xl p-3 mb-2";
                        card.innerHTML = `<div class="font-bold text-[10px] text-red-500">${expertRole} (Failed)</div>`;
                    }
                }
            }));
        } else {
            // Stage 5: Final aggregator (1 model)
            let masterModel = getDefaultModel();
            const configVal = state.researchConfig[`${stage.id}_agg`];
            if (configVal) {
                const [p, m] = configVal.split('|');
                masterModel = { provider: p, modelId: m, modelKey: m };
            }
            
            stageResults.push(`Final Synthesis Running on ${masterModel.modelKey || masterModel.modelId}...`);
        }
        
        if (state.currentChatId !== chatId) return;
        
        // Aggregate stage results
        const aggPrompt = `
            You are the Aggregator for ${stage.name}.
            AGGREGATION STYLE: ${state.aggregationStyle.toUpperCase()}
            
            INPUTS:
            ${stageResults.join('\n\n')}
            
            TASK: Synthesize these inputs into a cohesive output for this stage.
            ${stage.id === 'stage5'
                ? 'This is the Final Stage. Produce the Final Executive Summary, Core Analysis, and Conclusion.'
                : 'Prepare the output to be used as context for the next stage.'
            }
        `;
        
        const spinner = document.getElementById(`spin-${stageId}`);
        if (spinner) spinner.className = "fas fa-cog animate-spin text-orange-500";
        
        // Get aggregator model
        let aggModel = getDefaultModel();
        if (stage.id === 'stage5') {
            const configVal = state.researchConfig[`${stage.id}_agg`];
            if (configVal) {
                const [p, m] = configVal.split('|');
                aggModel = { provider: p, modelId: m, modelKey: m };
            }
        }
        
        const aggRes = await callModelWithFallback(aggModel.provider, aggModel.modelId,
            [{ role: 'user', content: aggPrompt }]);
        
        if (state.currentChatId !== chatId) return;
        
        aggregationContext = aggRes.content;
        stageOutputs.push(aggRes.content);
        
        if (spinner) spinner.className = "fas fa-check-circle text-green-500";
        
        expertsContainer.innerHTML += `
            <div class="col-span-full mt-2 pt-2 border-t border-[var(--border)]">
                <div class="font-bold text-xs text-[var(--text-primary)] mb-1">AGGREGATION RESULT</div>
                ${aggRes.thinking ? `
                    <div class="thinking-block">
                        <div class="thinking-header">Aggregator Thinking</div>
                        <div class="text-[10px]">${escapeHtml(aggRes.thinking)}</div>
                    </div>
                ` : ''}
                <div class="text-sm prose max-w-none dark:prose-invert">${formatMarkdown(aggRes.content)}</div>
            </div>
        `;
        
        // Final stage: Save answer and add export buttons
        if (stage.id === 'stage5') {
            window.lastAnswer = aggRes.content;
            
            const assistMsgObj = { role: 'assistant', content: aggRes.content };
            state.messages.push(assistMsgObj);
            
            const currentChat = state.chatHistory.find(c => c.id === state.currentChatId);
            if (currentChat) {
                currentChat.messages.push(assistMsgObj);
            }
            localStorage.setItem('sahu_chat_history', JSON.stringify(state.chatHistory));
            
            container.innerHTML += `
                <div class="mt-6 p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--accent)] shadow-lg">
                    <div class="font-bold text-lg mb-4 gradient-text">Final Research Output</div>
                    <div class="prose max-w-none text-sm">${formatMarkdown(aggRes.content)}</div>
                </div>
                <div class="export-buttons">
                    <button class="export-btn" onclick="copyToClipboard()"><i class="fas fa-copy"></i><span>Copy</span></button>
                    <button class="export-btn" onclick="downloadTxt()"><i class="fas fa-file-alt"></i><span>TXT</span></button>
                    <button class="export-btn" onclick="downloadPdf()"><i class="fas fa-file-pdf"></i><span>PDF</span></button>
                    <button class="export-btn" onclick="downloadDocx()"><i class="fas fa-file-word"></i><span>DOCX</span></button>
                </div>
            `;
        }
    }
    
    container.scrollTop = container.scrollHeight;
}

// ============================================
// SECTION 22: MAIN SEND MESSAGE FUNCTION
// ============================================

/**
 * Main send message handler
 */
async function sendMessage() {
    try {
        const input = document.getElementById('userInput');
        if (!input) return;
        
        let content = input.value.trim();
        
        // Timeout protection
        if (state.isProcessing && (Date.now() - (window.lastProcessStart || 0) > 60000)) {
            state.isProcessing = false;
        }
        
        if (!content && !state.uploadedFile) return;
        if (state.isProcessing) return;
        
        window.lastProcessStart = Date.now();
        state.isProcessing = true;
        
        const sendBtn = document.getElementById('sendBtn');
        if (sendBtn) sendBtn.disabled = true;
        
        const welcome = document.getElementById('welcomeScreen');
        const container = document.getElementById('messagesContainer');
        
        if (welcome) welcome.classList.add('hidden');
        const discovery = document.getElementById('discoveryFeed');
        if (discovery) discovery.style.display = 'none';
        if (container) container.classList.remove('hidden');
        
        // Create new chat if needed
        if (!state.currentChatId) {
            state.currentChatId = generateId();
            state.chatHistory.unshift({
                id: state.currentChatId,
                title: content.substring(0, 50),
                messages: [],
                timestamp: Date.now()
            });
        }
        const thisChatId = state.currentChatId;
        
        // Check for identity query
        if (checkIdentityQuery(content)) {
            displayIdentityResponse();
            input.value = '';
            input.style.height = 'auto';
            removeFile();
            state.isProcessing = false;
            if (sendBtn) sendBtn.disabled = false;
            return;
        }
        
        // Build display content
        let displayContent = content;
        if (state.uploadedFile) {
            displayContent += `\n[File: ${state.uploadedFile.name}]`;
        }
        
        // Save user message
        const userMsgObj = { role: 'user', content: displayContent, timestamp: Date.now() };
        state.messages.push(userMsgObj);
        
        const currentChat = state.chatHistory.find(c => c.id === state.currentChatId);
        if (currentChat) {
            currentChat.messages.push(userMsgObj);
        }
        localStorage.setItem('sahu_chat_history', JSON.stringify(state.chatHistory));
        renderChatHistory();
        
        // Display user message
        if (container) {
            container.innerHTML += `
                <div class="message-container message-user">
                    <div class="message-bubble">
                        <div class="message-content">${escapeHtml(displayContent)}</div>
                        <div class="message-meta">
                            <span>${state.mode.toUpperCase()} MODE</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';
        removeFile();
        
        // Update prompt refiner preview
        updatePromptRefinerPreview();
        
        // Web search integration (unless hidden by mode)
        const searchId = `search-${Date.now()}`;
        let fullPrompt = content;
        
        // Web search is always ON in Research and Search modes, toggleable in others
        const shouldSearch = (state.mode === 'research' || state.mode === 'search') ||
            (state.mode !== 'search' && document.getElementById('toolWebSearch')?.checked);
        
        if (shouldSearch && container) {
            container.innerHTML += `
                <div class="p-3 mb-2 rounded-xl bg-[var(--bg-tertiary)] text-xs border border-dashed border-[var(--accent)]" id="${searchId}">
                    <i class="fas fa-globe animate-spin mr-2"></i>Searching Web...
                </div>
            `;
            
            const searchResJson = await searchWeb(content);
            const searchRes = JSON.parse(searchResJson);
            const searchEl = document.getElementById(searchId);
            
            if (searchEl) {
                if (searchRes.length > 0) {
                    state.lastSources = searchRes;
                    const isSearchMode = state.mode === 'search';
                    let gridClass = `grid grid-cols-1 gap-2`;
                    if (!isSearchMode) {
                        gridClass += ` max-h-60 overflow-y-auto scrollbar-thin pr-1`;
                    }
                    
                    searchEl.className = "p-4 mb-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-sm";
                    searchEl.innerHTML = `
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <i class="fas fa-search"></i>
                                </div>
                                <div>
                                    <div class="font-semibold text-sm">Sources</div>
                                    <div class="text-xs text-[var(--text-secondary)]">Found ${searchRes.length} results</div>
                                </div>
                            </div>
                            ${isSearchMode ? '<div class="sahu-search-header text-sm">SahuAI Search</div>' : ''}
                        </div>
                        <div class="${gridClass}">
                            ${searchRes.map((s, idx) => `
                                <div class="p-3 rounded-lg bg-[var(--bg-tertiary)] border border-transparent hover:border-[var(--accent)] transition-all h-full">
                                    <a href="${s.link}" target="_blank" class="flex flex-col gap-2 h-full group text-decoration-none">
                                        <div class="flex items-center gap-2">
                                            <img src="https://www.google.com/s2/favicons?domain=${new URL(s.link).hostname}"
                                                class="w-4 h-4 opacity-70" onerror="this.src='about:blank'">
                                            <div class="font-medium text-xs text-blue-600 truncate flex-1">${escapeHtml(s.source)}</div>
                                            <span class="bg-gray-200 px-1.5 py-0.5 rounded text-[8px] font-bold">${idx + 1}</span>
                                        </div>
                                        <div class="font-medium text-xs text-[var(--text-primary)] line-clamp-2 leading-tight group-hover:underline">${escapeHtml(s.title)}</div>
                                        <div class="text-[10px] text-[var(--text-secondary)] line-clamp-2">${escapeHtml(s.snippet)}</div>
                                    </a>
                                </div>
                            `).join('')}
                        </div>
                    `;
                    
                    const searchContext = `\n\n[MANDATORY WEB SEARCH CONTEXT]:\nCurrent Date: ${new Date().toISOString().split('T')[0]}\n${searchRes.map((s, i) => `[${i + 1}] Source: ${s.title} (${s.link})\nEngine: ${s.source}\nDate: ${s.date || 'N/A'}\nSnippet: ${s.snippet}`).join('\n\n')}\n[END CONTEXT]\n`;
                    fullPrompt += searchContext;
                } else {
                    searchEl.style.display = 'none';
                }
            }
        }
        
        // Route to appropriate handler based on mode
        if (state.mode === 'research') {
            await runDeepResearch(fullPrompt, container, thisChatId);
        } else if (state.mode === 'standard' || state.mode === 'task') {
            // Check for Debate Mode
            if (state.features.debateMode) {
                await runDebateMode(fullPrompt, container, thisChatId);
            } else {
                // Standard multi-model aggregation
                await runStandardAggregation(fullPrompt, container, thisChatId);
            }
        } else if (state.mode === 'search') {
            // SahuAI Search mode: concise, cited responses
            await runSearchMode(fullPrompt, container, thisChatId);
        }
        
    } catch (error) {
        console.error("Critical error in sendMessage:", error);
        showToast("Error sending message: " + error.message, "error");
    } finally {
        state.isProcessing = false;
        const sendBtn = document.getElementById('sendBtn');
        if (sendBtn) sendBtn.disabled = false;
        updateTokenCounter();
    }
}

/**
 * Run standard multi-model aggregation
 * @param {string} fullPrompt - Full prompt with context
 * @param {HTMLElement} container - Messages container
 * @param {string} chatId - Chat ID
 */
async function runStandardAggregation(fullPrompt, container, chatId) {
    // Handle Single Model Mode
    if (state.singleModelMode) {
        await runSingleModelMode(fullPrompt, container, chatId);
        return;
    }
    
    const activeModels = state.selectedModels.filter(m =>
        state.activeProviders.includes(m.provider)
    );
    
    if (activeModels.length === 0) {
        showToast('No models selected', 'error');
        openModelSelector();
        return;
    }
    
    // Display expert grid
    const expertGridId = 'expert-grid-' + Date.now();
    if (container) {
        container.innerHTML += `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4" id="${expertGridId}"></div>
        `;
    }
    const expertGrid = document.getElementById(expertGridId);
    
    if (expertGrid) {
        expertGrid.innerHTML = activeModels.map((m, i) => {
            const count = m.count || 1;
            return `
                <div class="expert-card thinking rounded-xl p-3" id="expert-${i}">
                    <div class="flex items-center gap-2 mb-2">
                        <span>${PROVIDERS[m.provider]?.icon || '🤖'}</span>
                        <div class="flex-1 min-w-0">
                            <div class="font-medium text-sm truncate">${m.modelKey}</div>
                            <div class="text-[10px] text-[var(--text-secondary)]">
                                ${PROVIDERS[m.provider]?.name || 'Custom'} • ${count}x
                            </div>
                        </div>
                        <div class="typing-indicator flex gap-1">
                            <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                            <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                            <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                        </div>
                    </div>
                    <div class="text-xs text-[var(--text-secondary)]" id="expert-text-${i}">Thinking & Generating...</div>
                    <div class="text-xs mt-2 overflow-hidden max-h-32 text-gray-500 transition-all whitespace-pre-wrap" id="expert-stream-${i}"></div>
                </div>
            `;
        }).join('');
    }
    
    const expertResults = [];
    
    // Run all selected models (with response count support)
    await Promise.all(activeModels.map(async (model, idx) => {
        const responseCount = model.count || 1;
        const modelResponses = [];
        
        // Run model multiple times if count > 1
        for (let run = 0; run < responseCount; run++) {
            try {
                const onTokenUpdate = (text, thinking, chunk) => {
                    if (state.currentChatId !== chatId) return;
                    const cardText = document.getElementById(`expert-stream-${idx}`);
                    const cardStatus = document.getElementById(`expert-text-${idx}`);
                    if (cardText) {
                        cardText.textContent += chunk;
                        cardText.scrollTop = cardText.scrollHeight;
                    }
                    if (cardStatus) {
                        cardStatus.textContent = thinking ? "Thinking..." : "Generating...";
                    }
                };
                
                let res = await callModelWithFallback(model.provider, model.modelId,
                    [{ role: 'user', content: fullPrompt }], 0, onTokenUpdate);
                
                if (state.currentChatId !== chatId) return;
                
                modelResponses.push(res);
                
            } catch (e) {
                modelResponses.push({ success: false, error: e.message });
            }
        }
        
        // Combine multiple responses from same model
        if (modelResponses.length > 0) {
            const successful = modelResponses.filter(r => r.content);
            if (successful.length > 0) {
                // Combine responses (or use last if preferred)
                const combinedContent = successful.map(r => r.content).join('\n\n---\n\n');
                const combinedThinking = successful.map(r => r.thinking).filter(t => t).join('\n\n');
                
                expertResults[idx] = {
                    ...model,
                    content: combinedContent,
                    thinking: combinedThinking,
                    success: true,
                    responseCount: responseCount
                };
                
                // Update UI
                const card = document.getElementById(`expert-${idx}`);
                if (card) {
                    card.className = 'expert-card complete rounded-xl p-3';
                    card.innerHTML = `
                        <div class="flex items-center gap-2 mb-2">
                            <span>${PROVIDERS[model.provider]?.icon || '🤖'}</span>
                            <div class="flex-1 min-w-0">
                                <div class="font-medium text-sm truncate">${model.modelKey}</div>
                                <div class="text-[10px] text-[var(--text-secondary)]">
                                    ${PROVIDERS[model.provider]?.name || 'Custom'} • ${responseCount}x
                                </div>
                            </div>
                            <i class="fas fa-check-circle text-green-500"></i>
                        </div>
                        ${combinedThinking ? `
                            <div class="thinking-block">
                                <div class="thinking-header"><i class="fas fa-brain"></i> Thinking Process</div>
                                <div class="text-[var(--text-secondary)] text-xs whitespace-pre-wrap max-h-32 overflow-y-auto">${escapeHtml(combinedThinking)}</div>
                            </div>
                        ` : ''}
                        <div class="text-sm max-h-64 overflow-y-auto">${formatMarkdown(combinedContent)}</div>
                    `;
                }
            }
        }
    }));
    
    if (state.currentChatId !== chatId) return;
    
    const successfulExperts = expertResults.filter(r => r && r.success && r.content);
    
    // Neural Consensus (if enabled and multiple successful responses)
    if (successfulExperts.length > 1 && state.features.neuralConsensus) {
        const councilId = `council-${Date.now()}`;
        if (container) {
            container.innerHTML += `<div id="${councilId}" class="consensus-panel mb-4"></div>`;
        }
        const councilEl = document.getElementById(councilId);
        if (councilEl) {
            let matrixHtml = `
                <div class="overflow-x-auto">
                    <table class="agreement-table">
                        <thead>
                            <tr><th>Model</th>
            `;
            successfulExperts.forEach(m => {
                matrixHtml += `<th>${m.modelKey.substring(0, 10)}...</th>`;
            });
            matrixHtml += '</tr></thead><tbody>';
            
            successfulExperts.forEach((rowModel, i) => {
                matrixHtml += `<tr><td class="font-bold text-xs truncate max-w-[100px]" title="${rowModel.modelKey}">${rowModel.modelKey}</td>`;
                successfulExperts.forEach((colModel, j) => {
                    if (i === j) {
                        matrixHtml += '<td class="bg-gray-100 text-center text-xs">-</td>';
                    } else {
                        const sim = stringSimilarity.compareTwoStrings(rowModel.content, colModel.content);
                        const pct = Math.round(sim * 100);
                        let colorClass = 'text-red-500';
                        if (pct >= 80) colorClass = 'text-green-600 font-bold';
                        else if (pct >= 50) colorClass = 'text-yellow-600 font-medium';
                        matrixHtml += `<td class="text-center text-xs ${colorClass}">${pct}%</td>`;
                    }
                });
                matrixHtml += '</tr>';
            });
            matrixHtml += '</tbody></table></div>';
            matrixHtml += `
                <div class="text-[10px] text-[var(--text-secondary)] mt-2 text-right flex justify-end gap-3">
                    <span><i class="fas fa-circle text-green-500 text-[8px]"></i> >80% High</span>
                    <span><i class="fas fa-circle text-yellow-500 text-[8px]"></i> 50-80% Med</span>
                    <span><i class="fas fa-circle text-red-500 text-[8px]"></i> <50% Low</span>
                </div>
            `;
            councilEl.innerHTML = `
                <div class="font-bold text-sm mb-2 flex items-center gap-2 text-[var(--accent)]">
                    <i class="fas fa-balance-scale"></i> Model Council Agreement
                </div>
                ${matrixHtml}
            `;
        }
    }
    
    // Aggregation Pipeline
    const stageVal = state.stageSelector || '1';
    let stagesToRun = [];
    if (stageVal === '1') stagesToRun = [3];
    else if (stageVal === '2') stagesToRun = [1, 3];
    else if (stageVal === '3') stagesToRun = [1, 2, 3];
    
    let currentContext = successfulExperts.map(r => `### ${r.modelKey}\n${r.content}`).join('\n\n');
    window.lastAnswer = currentContext;
    
    if (!currentContext && activeModels.length > 0) {
        if (container) {
            container.innerHTML += `
                <div class="text-red-500 p-4 border border-red-200 rounded-xl">
                    All experts failed to respond. Check API keys and connection.
                </div>
            `;
        }
    } else {
        for (const stage of stagesToRun) {
            if (state.currentChatId !== chatId) return;
            
            const aggModel = activeModels.find(m => m.stage === String(stage));
            const modelToUse = aggModel || activeModels[0];
            if (!modelToUse) continue;
            
            const stageId = `stage-${stage}-${Date.now()}`;
            const stageContentId = `content-${stageId}`;
            
            if (container) {
                container.innerHTML += `
                    <div class="aggregator-response stage-${stage} rounded-2xl p-4" id="${stageId}">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-gray-400">${stage}</div>
                            <div>
                                <span class="font-semibold text-sm">Stage ${stage}</span>
                                <p class="text-xs text-[var(--text-secondary)]">${modelToUse.modelKey}</p>
                            </div>
                        </div>
                        <div class="text-sm whitespace-pre-wrap" id="${stageContentId}">Generating...</div>
                    </div>
                `;
                container.scrollTop = container.scrollHeight;
            }
            
            try {
                const prompt = AGGREGATOR_PROMPTS[`stage${stage}`];
                
                const onStageToken = (text, thinking, chunk) => {
                    if (state.currentChatId !== chatId) return;
                    const el = document.getElementById(stageContentId);
                    if (el) el.textContent += chunk;
                    if (container) container.scrollTop = container.scrollHeight;
                };
                
                const stageContentEl = document.getElementById(stageContentId);
                if (stageContentEl) stageContentEl.textContent = "";
                
                const res = await callModelWithFallback(modelToUse.provider, modelToUse.modelId,
                    [{ role: 'system', content: prompt }, { role: 'user', content: currentContext }],
                    0, onStageToken);
                
                if (state.currentChatId !== chatId) return;
                
                currentContext = res.content;
                window.lastAnswer = res.content;
                
                // Save final answer to chat history
                if (stage === stagesToRun[stagesToRun.length - 1]) {
                    const assistMsgObj = { role: 'assistant', content: res.content, timestamp: Date.now() };
                    state.messages.push(assistMsgObj);
                    if (currentChat) currentChat.messages.push(assistMsgObj);
                    localStorage.setItem('sahu_chat_history', JSON.stringify(state.chatHistory));
                }
                
                // Update stage UI
                const stageEl = document.getElementById(stageId);
                if (stageEl) {
                    stageEl.innerHTML = `
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-green-500">${stage}</div>
                            <div class="flex-1">
                                <span class="font-semibold text-sm">Stage ${stage}</span>
                                <p class="text-xs text-[var(--text-secondary)]">${modelToUse.modelKey}</p>
                            </div>
                            <button onclick="togglePin('${escapeHtml(res.content.substring(0, 100))}')"
                                class="text-[var(--text-secondary)] hover:text-yellow-500">
                                <i class="fas fa-thumbtack"></i>
                            </button>
                        </div>
                        ${res.thinking ? `
                            <div class="thinking-block">
                                <div class="thinking-header"><i class="fas fa-brain"></i> Thinking</div>
                                <div class="text-[var(--text-secondary)] text-xs whitespace-pre-wrap">${escapeHtml(res.thinking)}</div>
                            </div>
                        ` : ''}
                        <div class="prose max-w-none text-sm">${formatMarkdown(res.content)}</div>
                    `;
                }
            } catch (e) {
                const stageEl = document.getElementById(stageId);
                if (stageEl) {
                    stageEl.innerHTML += `
                        <div class="text-red-500 text-sm mt-2">
                            Aggregation Failed: ${e.message}
                        </div>
                    `;
                }
            }
        }
    }
    
    // Add export buttons
    if (container) {
        container.innerHTML += `
            <div class="export-buttons">
                <button class="export-btn" onclick="copyToClipboard()"><i class="fas fa-copy"></i><span>Copy</span></button>
                <button class="export-btn" onclick="downloadTxt()"><i class="fas fa-file-alt"></i><span>TXT</span></button>
                <button class="export-btn" onclick="downloadPdf()"><i class="fas fa-file-pdf"></i><span>PDF</span></button>
                <button class="export-btn" onclick="downloadDocx()"><i class="fas fa-file-word"></i><span>DOCX</span></button>
                <button class="export-btn" onclick="downloadMarkdown()"><i class="fab fa-markdown"></i><span>MD</span></button>
                <button class="export-btn" onclick="openPreview()"><i class="fas fa-eye"></i><span>Preview</span></button>
            </div>
        `;
        container.scrollTop = container.scrollHeight;
    }
}

/**
 * Run single model mode
 * @param {string} fullPrompt - Full prompt
 * @param {HTMLElement} container - Container
 * @param {string} chatId - Chat ID
 */
async function runSingleModelMode(fullPrompt, container, chatId) {
    const model = state.selectedModels.find(m => m.modelId === state.singleModelId) ||
        { provider: 'nvidia', modelId: state.singleModelId, modelKey: state.singleModelId };
    
    if (!model) {
        showToast('Selected model not found', 'error');
        return;
    }
    
    const divId = `single-${Date.now()}`;
    if (container) {
        container.innerHTML += `
            <div class="expert-card thinking rounded-xl p-3 mb-4" id="${divId}">
                <div class="flex items-center gap-2 mb-2">
                    <span class="text-xl">${PROVIDERS[model.provider]?.icon || '🤖'}</span>
                    <div class="flex-1 min-w-0">
                        <div class="font-medium text-sm truncate">${model.modelKey} (Single Mode)</div>
                        <div class="text-[10px] text-[var(--text-secondary)]">${PROVIDERS[model.provider]?.name || 'Custom'}</div>
                    </div>
                    <div class="typing-indicator flex gap-1">
                        <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                        <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                        <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                    </div>
                </div>
                <div class="text-xs text-[var(--text-secondary)] mb-1" id="status-${divId}">Thinking...</div>
                <div class="text-sm whitespace-pre-wrap" id="content-${divId}"></div>
            </div>
        `;
    }
    
    try {
        const onToken = (text, thinking, chunk) => {
            if (state.currentChatId !== chatId) return;
            const el = document.getElementById(`content-${divId}`);
            if (el) {
                el.textContent += chunk;
                el.scrollTop = el.scrollHeight;
            }
            const st = document.getElementById(`status-${divId}`);
            if (st) st.textContent = thinking ? "Thinking..." : "Generating...";
        };
        
        const res = await callModelWithFallback(model.provider, model.modelId,
            [{ role: 'user', content: fullPrompt }], 0, onToken);
        
        if (state.currentChatId !== chatId) return;
        
        // Save response
        window.lastAnswer = res.content;
        const assistMsgObj = { role: 'assistant', content: res.content, timestamp: Date.now() };
        state.messages.push(assistMsgObj);
        
        const currentChat = state.chatHistory.find(c => c.id === state.currentChatId);
        if (currentChat) {
            currentChat.messages.push(assistMsgObj);
        }
        localStorage.setItem('sahu_chat_history', JSON.stringify(state.chatHistory));
        
        // Update UI
        const card = document.getElementById(divId);
        if (card) {
            card.className = "expert-card complete rounded-xl p-3 mb-4";
            card.innerHTML = `
                <div class="flex items-center gap-2 mb-2">
                    <span>${PROVIDERS[model.provider]?.icon || '🤖'}</span>
                    <div class="flex-1 min-w-0">
                        <div class="font-medium text-sm truncate">${model.modelKey} (Single Mode)</div>
                        <div class="text-[10px] text-[var(--text-secondary)]">${PROVIDERS[model.provider]?.name || 'Custom'}</div>
                    </div>
                    <i class="fas fa-check-circle text-green-500"></i>
                </div>
                ${res.thinking ? `
                    <div class="thinking-block">
                        <div class="thinking-header"><i class="fas fa-brain"></i> Thinking Process</div>
                        <div class="text-[var(--text-secondary)] text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">${escapeHtml(res.thinking)}</div>
                    </div>
                ` : ''}
                <div class="text-sm max-h-none overflow-y-auto">${formatMarkdown(res.content)}</div>
            `;
        }
        
        // Add export buttons
        if (container) {
            container.innerHTML += `
                <div class="export-buttons">
                    <button class="export-btn" onclick="copyToClipboard()"><i class="fas fa-copy"></i><span>Copy</span></button>
                    <button class="export-btn" onclick="downloadTxt()"><i class="fas fa-file-alt"></i><span>TXT</span></button>
                    <button class="export-btn" onclick="downloadPdf()"><i class="fas fa-file-pdf"></i><span>PDF</span></button>
                    <button class="export-btn" onclick="downloadDocx()"><i class="fas fa-file-word"></i><span>DOCX</span></button>
                </div>
            `;
        }
        
    } catch (e) {
        const card = document.getElementById(divId);
        if (card) {
            card.className = "expert-card error rounded-xl p-3 mb-4";
            card.innerHTML = `
                <div class="font-bold text-[10px] text-red-500">
                    ${model.modelKey} (Failed: ${e.message})
                </div>
            `;
        }
        showToast('Model request failed', 'error');
    }
}

/**
 * Run SahuAI Search mode
 * @param {string} fullPrompt - Full prompt with search context
 * @param {HTMLElement} container - Container
 * @param {string} chatId - Chat ID
 */
async function runSearchMode(fullPrompt, container, chatId) {
    // Use single best model for search mode (fast response)
    const model = state.selectedModels[0] || { provider: 'nvidia', modelId: 'minimaxai/minimax-m2.5', modelKey: 'MiniMax M2.5' };
    
    const divId = `search-${Date.now()}`;
    if (container) {
        container.innerHTML += `
            <div class="aggregator-response rounded-2xl p-4" id="${divId}">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-blue-500">
                        <i class="fas fa-search"></i>
                    </div>
                    <div>
                        <span class="font-semibold text-sm">SahuAI Search Response</span>
                        <p class="text-xs text-[var(--text-secondary)]">${model.modelKey}</p>
                    </div>
                </div>
                <div class="text-sm whitespace-pre-wrap" id="content-${divId}">Searching and synthesizing...</div>
            </div>
        `;
    }
    
    try {
        const onToken = (text, thinking, chunk) => {
            if (state.currentChatId !== chatId) return;
            const el = document.getElementById(`content-${divId}`);
            if (el) {
                el.textContent += chunk;
                el.scrollTop = el.scrollHeight;
            }
        };
        
        const res = await callModelWithFallback(model.provider, model.modelId,
            [{ role: 'user', content: fullPrompt }], 0, onToken);
        
        if (state.currentChatId !== chatId) return;
        
        // Save response
        window.lastAnswer = res.content;
        const assistMsgObj = { role: 'assistant', content: res.content, timestamp: Date.now() };
        state.messages.push(assistMsgObj);
        
        const currentChat = state.chatHistory.find(c => c.id === state.currentChatId);
        if (currentChat) {
            currentChat.messages.push(assistMsgObj);
        }
        localStorage.setItem('sahu_chat_history', JSON.stringify(state.chatHistory));
        
        // Update UI
        const card = document.getElementById(divId);
        if (card) {
            card.innerHTML = `
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-blue-500">
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="flex-1">
                        <span class="font-semibold text-sm">SahuAI Search Response</span>
                        <p class="text-xs text-[var(--text-secondary)]">${model.modelKey}</p>
                    </div>
                    <button onclick="togglePin('${escapeHtml(res.content.substring(0, 100))}')"
                        class="text-[var(--text-secondary)] hover:text-yellow-500">
                        <i class="fas fa-thumbtack"></i>
                    </button>
                </div>
                ${res.thinking ? `
                    <div class="thinking-block">
                        <div class="thinking-header"><i class="fas fa-brain"></i> Search Reasoning</div>
                        <div class="text-[var(--text-secondary)] text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">${escapeHtml(res.thinking)}</div>
                    </div>
                ` : ''}
                <div class="prose max-w-none text-sm">${formatMarkdown(res.content)}</div>
            `;
        }
        
        // Add export buttons
        if (container) {
            container.innerHTML += `
                <div class="export-buttons">
                    <button class="export-btn" onclick="copyToClipboard()"><i class="fas fa-copy"></i><span>Copy</span></button>
                    <button class="export-btn" onclick="downloadTxt()"><i class="fas fa-file-alt"></i><span>TXT</span></button>
                    <button class="export-btn" onclick="downloadPdf()"><i class="fas fa-file-pdf"></i><span>PDF</span></button>
                </div>
            `;
        }
        
    } catch (e) {
        const card = document.getElementById(divId);
        if (card) {
            card.innerHTML = `
                <div class="text-red-500 text-sm">
                    Search failed: ${e.message}
                </div>
            `;
        }
        showToast('Search failed', 'error');
    }
}

// ============================================
// SECTION 23: INITIALIZATION & EVENT LISTENERS
// ============================================

/**
 * Initialize theme
 */
function initTheme() {
    if (state.theme === 'dark') {
        document.body.classList.add('dark-mode');
        const icon = document.getElementById('themeIcon');
        const text = document.getElementById('themeText');
        if (icon) icon.className = 'fas fa-sun';
        if (text) text.textContent = 'Dark Mode';
    }
}

/**
 * Initialize Pyodide for Python execution
 */
async function initPyodide() {
    try {
        pyodide = await loadPyodide();
        await pyodide.loadPackage("micropip");
        console.log('✅ Pyodide initialized');
    } catch (e) {
        console.warn("⚠️ Pyodide init failed:", e);
    }
}

/**
 * Initialize speech recognition
 */
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        console.log('✅ Speech recognition available');
    } else {
        console.warn('⚠️ Speech recognition not supported');
    }
}

/**
 * Handle hash-based conversation sharing
 */
function handleSharedConversation() {
    if (window.location.hash) {
        try {
            const data = JSON.parse(
                LZString.decompressFromEncodedURIComponent(window.location.hash.substring(1))
            );
            if (data && Array.isArray(data)) {
                state.messages = data;
                showToast('Conversation Restored');
                
                const container = document.getElementById('messagesContainer');
                const welcome = document.getElementById('welcomeScreen');
                
                if (container && welcome) {
                    welcome.classList.add('hidden');
                    container.classList.remove('hidden');
                    container.innerHTML = '';
                    
                    state.messages.forEach(msg => {
                        if (msg.role === 'user') {
                            container.innerHTML += `
                                <div class="message-container message-user">
                                    <div class="message-bubble">
                                        <div class="message-content">${escapeHtml(msg.content)}</div>
                                    </div>
                                </div>
                            `;
                        } else if (msg.role === 'assistant') {
                            container.innerHTML += `
                                <div class="message-container message-assistant">
                                    <div class="message-bubble">
                                        <div class="message-content">${formatMarkdown(msg.content)}</div>
                                    </div>
                                </div>
                            `;
                        }
                    });
                }
            }
        } catch (e) {
            console.warn('Failed to restore shared conversation:', e);
        }
    }
}

/**
 * Set up keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
        // Ctrl+Enter: Send message
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
        // Ctrl+K: Focus history search
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            const search = document.getElementById('historySearch');
            if (search) {
                search.focus();
                search.select();
            }
        }
        // Escape: Cancel processing
        if (e.key === 'Escape') {
            state.isProcessing = false;
            const sendBtn = document.getElementById('sendBtn');
            if (sendBtn) sendBtn.disabled = false;
        }
    });
}

/**
 * Main initialization
 */
async function init() {
    console.log('🚀 SahuAI Agent v5.0 Initializing...');
    
    // Load state from localStorage
    loadState();
    
    // Load chat history
    loadChatHistory();
    
    // Initialize theme
    initTheme();
    
    // Render UI components
    renderProviderCheckboxes();
    renderApiKeyInputs();
    renderLanguageSelector();
    renderSearchEngines();
    renderResearchConfig();
    renderPinned();
    
    // Update UI
    updateUI();
    
    // Initialize external libraries
    await initPyodide();
    initSpeechRecognition();
    
    // Handle shared conversations
    handleSharedConversation();
    
    // Set up keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Set default mode
    updateMode(state.mode);
    
    // Update language
    updateLanguage(state.language);
    
    console.log('✅ SahuAI Agent v5.0 Ready');
    showToast('SahuAI Agent v5.0 Loaded');
}

// ============================================
// SECTION 24: DOM CONTENT LOADED
// ============================================

document.addEventListener('DOMContentLoaded', init);

// Export functions to window for inline onclick handlers
window.toggleSidebar = toggleSidebar;
window.toggleDeepThink = toggleDeepThink;
window.toggleDeepThinkFromMenu = toggleDeepThinkFromMenu;
window.toggleWebSearchFromMenu = toggleWebSearchFromMenu;
window.toggleTranslateFromMenu = toggleTranslateFromMenu;
window.updateMode = updateMode;
window.toggleTaskType = toggleTaskType;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.navigateSettings = navigateSettings;
window.openSourceCode = openSourceCode;
window.closeSourceCode = closeSourceCode;
window.copySourceCode = copySourceCode;
window.toggleTheme = toggleTheme;
window.openDocs = openDocs;
window.closeDocs = closeDocs;
window.toggleToolsMenu = toggleToolsMenu;
window.toggleLanguageCard = toggleLanguageCard;
window.filterLanguages = filterLanguages;
window.selectLanguage = selectLanguage;
window.togglePromptRefinerPanel = togglePromptRefinerPanel;
window.togglePromptRefinerSetting = togglePromptRefinerSetting;
window.toggleSingleModelMode = toggleSingleModelMode;
window.saveSettings = saveSettings;
window.toggleProvider = toggleProvider;
window.toggleSearchEngine = toggleSearchEngine;
window.toggleAllSearchEngines = toggleAllSearchEngines;
window.addCustomSearchEngine = addCustomSearchEngine;
window.addCustomProvider = addCustomProvider;
window.openModelSelector = openModelSelector;
window.closeModelSelector = closeModelSelector;
window.toggleAllModels = toggleAllModels;
window.toggleModelSelection = toggleModelSelection;
window.setModelStage = setModelStage;
window.saveModelSelection = saveModelSelection;
window.newChat = newChat;
window.triggerFileUpload = triggerFileUpload;
window.handleFileUpload = handleFileUpload;
window.removeFile = removeFile;
window.handleKeyDown = handleKeyDown;
window.autoResize = autoResize;
window.quickPrompt = quickPrompt;
window.generateShareLink = generateShareLink;
window.loadChat = loadChat;
window.filterHistory = filterHistory;
window.startVoiceInput = startVoiceInput;
window.translateResponse = translateResponse;
window.copyToClipboard = copyToClipboard;
window.downloadMarkdown = downloadMarkdown;
window.downloadTxt = downloadTxt;
window.downloadPdf = downloadPdf;
window.downloadDocx = downloadDocx;
window.openPreview = openPreview;
window.openArtifact = openArtifact;
window.closeArtifact = closeArtifact;
window.switchCanvasTab = switchCanvasTab;
window.togglePin = togglePin;
window.sendMessage = sendMessage;
window.updateResearchStageConfig = updateResearchStageConfig;

// ============================================
// END OF SAHUAI AGENT v5.0 - index.js
// ============================================
