import { AngularEditorConfig } from "@kolkov/angular-editor";

export const widgetProductTypes: Array<string> = [
    'smart-tiles',
    'aurora-slider',
    'aurora-grid',
    'products',
    'motion-canvas',
];

export const widgetImageTypes: Array<string> = [
    'image-slider',
    'radiant-rectangles',
    'quad-square',
    'prime-plates',
    'elite-elements',
    'noble-nodes',
    'classic-banners',
    'magestic-mosaic',
    'glamour-glaze',
    'dazzle-design',
    'grandeur-gallery',
    'celestial-canvas',
    'twin-towers',
    'stellar-selections',
    'slider-spotlight',
    'trending-teasers',
    'text-twirl',
    'vibrant-banner',
    'vibrant-video-banner',
    'animation-banner',
    'brick-mansory-grid',
    'primary-triple-grid',
    'full-banner',
    'modern-carousel',
    'key-points-grid',
];

export const redirectionItems: Array<{ key: string, value: string }> = [
    { key: 'None', value: '' },
    { key: 'Open category products', value: 'category' },
    { key: 'Open all products', value: 'all-products' },
    { key: 'Open brand products', value: 'brand' },
    { key: 'Open collection products', value: 'collection' },
    { key: 'Open product details', value: 'products' },
    { key: 'Open catalog page', value: 'catalog' },
    { key: 'Open blogs', value: 'blogs' },
    { key: 'Open weblink', value: 'web-links' },
    { key: 'Open static page', value: 'static-pages' },
    { key: 'Open CMS page', value: 'cms-pages' },
    { key: 'Search filters', value: 'search-filters' },
];

export const sortOptions: Array<{ key: string, value: string }> = [
    { key: 'Popularity', value: 'popularity' },
    { key: 'Newest', value: 'newest' },
    { key: 'Oldest', value: 'oldest' },
    { key: 'Price: Low to High', value: 'ascending' },
    { key: 'Price: High to Low', value: 'descending' },
];

export const cmsPages: Array<{ title: string, value: string }> = [
    { title: 'FAQs', value: '/faqs' },
    { title: 'Stores', value: '/stores' },
    { title: 'Brands', value: '/brands' },
    { title: 'Category', value: '/categories' },
    { title: 'Reviews', value: '/reviews' },
    { title: 'Contact Us', value: '/contact-us' },
];

export const searchRedirections: Array<string> = [
    'category',
    'brands',
    'collection',
    'products',
    'catalog',
    'blogs',
];

export const hiddenHeaderItems: Array<string> = [
    'sale-timer',
    'hyperlinkhero',
    'insight-hub',
    'key-points-grid',
    'clickpulse-panel',
];

export const hiddenDisplaySettings: Array<string> = [
    'clickpulse-panel',
];

export const editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
        { class: 'arial', name: 'Arial' },
        { class: 'times-new-roman', name: 'Times New Roman' },
        { class: 'calibri', name: 'Calibri' },
        { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
        {
            name: 'quote',
            class: 'quote',
        },
        {
            name: 'redText',
            class: 'redText',
        },
        {
            name: 'titleText',
            class: 'titleText',
            tag: 'h1',
        },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [['bold', 'italic'], ['fontSize']],
};

export interface ClickPulsePanel {
    title: string,
    description: string,
    displayType: 'grid' | 'carousel',
    gridColumns: number,
    carouselItems: number,
    tabIndex: number,
    tabItems: Array<{
        title: string,
        blockType: 'image' | 'video' | 'text',
        imageItem: any,
        videoItem: any,
        contentItem: string,
        isCollapsed: boolean,
        tabItemIndex: number,
        isCoordsEnabled: string,
        hotspots: Array<{
            xCoords: number,
            yCoords: number,
            productId: string,
            label: string,
        }>
    }>,
    isCollapsed: boolean,
}