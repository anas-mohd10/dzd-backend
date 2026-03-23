export interface WidgetProps {
    title: string;
    type: string;
    icon: string;
    description: string;
}

export const widgets: Array<WidgetProps> = [
    {
        title: 'Magestic Mosaic',
        type: 'magestic-mosaic',
        icon: 'assets/widgets/rush-lake.png',
        description: `The following widget can be used to show images within a particular category.The widget contains images. <strong>Magestic Mosaic - 800(w) x 244(h) - 1(Largest one) , 390(w) x 244(h) - 4(Smaller ones)</strong>`,
    }, {
        title: 'Glamour Glaze',
        type: 'glamour-glaze',
        icon: 'assets/widgets/volta-lake.png',
        description: 'The widget can be used to showcase new brands or existing brands.The widget contains two section with image and description section on either side and vice-versa.The description box has a black border, with heading, subheading and button. <strong>Glamour Glaze - 800(w) x 697(h) - 1(Bigger one) ,390(w) x 220(h) - 3(Smaller ones)</strong>',
    }, {
        title: 'Dazzle Design',
        type: 'dazzle-design',
        icon: 'assets/widgets/1x4.png',
        description: 'The following widget can be used to show collection of categories.The following widget is a collection of card where it has one main card and other 4 cards.The cards contain an image and decrotaive text which is center aligned with the image. <strong>Dazzle Design - 595(w) x 595(h) - 1(bigger one) , 287(w) x 287(h) - 4 (smaller ones)</strong>',
    }, {
        title: 'Celestial Canvas',
        type: 'celestial-canvas',
        icon: 'assets/widgets/celestial-canvas.png',
        description: 'This widget is used to showcase banner carousel and video',
    }, {
        title: 'Blogs',
        type: 'blogs',
        icon: 'assets/widgets/blogs.png',
        description: 'The following widget can be used to display the recent blogs, or categories.The widget contains image and white transluscent descriptive box.The description box contain text and button.',
    }, {
        title: 'Custom HTML',
        type: 'html',
        icon: 'assets/widgets/custom-html.png',
        description: '',
    }, {
        title: 'Image Slider',
        type: 'image-slider',
        icon: 'assets/widgets/image-slider.png',
        description: 'The following widget can be used to show images within a particular category.The widget contains images.',
    }, {
        title: 'Video',
        type: 'video',
        icon: 'assets/widgets/video.png',
        description: 'This widget is used to showcase full width video only.',
    }, {
        title: 'Motion Canvas',
        type: 'motion-canvas',
        icon: 'assets/widgets/regal-rolls.png',
        description: 'The following widget can be used to showcase products.The widget contains an image of the product and white descriptive box.The descriptive box contains name of the product, actual price and off price and off percentage, which are center aligned with respect to the box.',
    },
    {
        title: 'Locations',
        type: 'locations-slider',
        icon: 'assets/widgets/regal-rolls.png',
        description: 'The following widget can be used to showcase locations.The widget contains an image of the locations and white descriptive box.The descriptive box contains name of the location, actual price and off price and off percentage, which are center aligned with respect to the box.',
    },
    {
        title: 'Products',
        type: 'products',
        icon: 'assets/widgets/blogs.png',
        description: 'The following widget can be used to showcase products.The widget contains an image of the product and white descriptive box.The descriptive box contains name of the product, actual price and off price and off percentage, which are center aligned with respect to the box.',
    }, {
        title: 'Noble Nodes',
        type: 'noble-nodes',
        icon: 'assets/widgets/noble-nodes.png',
        description: 'The following widget can be used to show images within a particular category.The widget contains images.<strong> Noble Nodes - 595(w) x 320(h) - 2(equal ones),390(w) x 320(h) - 1(smaller one), 800(w) x 320(h) - 1(bigger one)</strong>',
    }, {
        title: 'Prime Plates',
        type: 'prime-plates',
        icon: 'assets/widgets/prime-plates.png',
        description: 'The following widget can be used to show images within a particular category.The widget contains images.<strong>Prime Plates - 390(w) x 320(h) - 1(smaller one),800(w) x 320(h) - 1(bigger one)</strong>',
    }, {
        title: 'Elite Elements',
        type: 'elite-elements',
        icon: 'assets/widgets/elite-elements.png',
        description: 'The following widget can be used to show images within a particular category.The widget contains images.',
    }, {
        title: 'Sale Timer',
        type: 'sale-timer',
        icon: 'assets/widgets/sale-timer.png',
        description: 'This widget is used to showcase a sale timer.',
    }, {
        title: 'Twin Towers',
        type: 'twin-towers',
        icon: 'assets/widgets/twin-towers.png',
        description: 'The following widget can be used to show images within a particular category.The widget contains images.<strong>Twin Towers - 595(w) x 320(h) - 2</strong>',
    }, {
        title: 'Slider Spotlight',
        type: 'slider-spotlight',
        icon: 'assets/widgets/slider-spotlight.png',
        description: 'The following widget can be used to show images within a particular category. The widget contains images.',
    }, {
        title: 'Trending Teasers',
        type: 'trending-teasers',
        icon: 'assets/widgets/trending-teasers.png',
        description: 'The following widget can be used to show images within a particular category. The widget contains images. <strong>Trending Teasers - 1210(w) x 320(h) - 1(bigger one),595(w) x 320(h) - 2(smaller ones)</strong>',
    }, {
        title: 'Smart Tiles',
        type: 'smart-tiles',
        icon: 'assets/widgets/smart-tiles.png',
        description: 'The following widget can be used to showcase products.The widget contains an image of the product and white descriptive box.The descriptive box contains name of the product, actual price and off price and off percentage, which are center aligned with respect to the box.',
    }, {
        title: 'Stellar Selections',
        type: 'stellar-selections',
        icon: 'assets/widgets/stellar-selections.png',
        description: 'The following widget can be used to show images within a particular category. The widget contains images.',
    }, {
        title: 'Testimonials',
        type: 'testimonial-cards',
        icon: 'assets/widgets/image-slider.png',
        description: 'The following widget can be used to show images within a particular category. The widget contains images.',
    }, {
        title: 'Radiant Rectangles',
        type: 'radiant-rectangles',
        icon: 'assets/widgets/radiant-rectangles.png',
        description: 'The following widget can be used to showcase products.The widget contains an image of the product and white descriptive box.The descriptive box contains name of the product, actual price and off price and off percentage, which are center aligned with respect to the box.',
    }, {
        title: 'Quad Squares',
        type: 'quad-square',
        icon: 'assets/widgets/quad-sqaure.png',
        description: 'The following widget can be used to show images within a particular category. The widget contains images.',
    }, {
        title: 'Insight Hub',
        type: 'insight-hub',
        icon: 'assets/widgets/store-chronicles.png',
        description: 'The following widget can be used to show images within a particular category. The widget contains images.',
    }, {
        title: 'Delivery Timer',
        type: 'delivery-timer',
        icon: 'assets/widgets/delivery-timer.png',
        description: 'The following widget can be used to run a delivery timer with custom designs',
    }, {
        title: 'Hyper Link Hero',
        type: 'hyperlinkhero',
        icon: 'assets/widgets/picture-palette.png',
        description: 'The following widget can be used to show images within a particular category. The widget contains images.',
    }, {
        title: 'Aurora Grid',
        type: 'aurora-grid',
        icon: 'assets/widgets/aurora-grid.png',
        description: 'The following widget can be used to run a delivery timer with custom designs',
    }, {
        title: 'Aurora Slider',
        type: 'aurora-slider',
        icon: 'assets/widgets/aurora-slider.png',
        description: 'The following widget can be used to show images within a particular category. The widget contains images.',
    }, {
        title: 'Text Twirl',
        type: 'text-twirl',
        icon: 'assets/widgets/text-twirl.png',
        description: 'The following widget can be used to show limited set of medias with title and description. The widget contains images.',
    }, {
        title: 'Full Banner',
        type: 'full-banner',
        icon: 'assets/widgets/text-twirl.png',
        description: 'The following widget can be used to show limited set of medias with title and description. The widget contains images.',
    }, {
        title: 'Animation Banner',
        type: 'animation-banner',
        icon: 'assets/widgets/text-twirl.png',
        description: 'The following widget can be used to show limited set of medias with title and description. The widget contains images.',
    }, {
        title: 'Bricks Mansory Grid',
        type: 'brick-mansory-grid',
        icon: 'assets/widgets/text-twirl.png',
        description: 'The following widget can be used to show limited set of medias with title and description. The widget contains images.',
    }, {
        title: 'Primary Triple Grid',
        type: 'primary-triple-grid',
        icon: 'assets/widgets/text-twirl.png',
        description: 'The following widget can be used to show limited set of medias with title and description. The widget contains images.',
    }, {
        title: 'Vibrant Banner',
        type: 'vibrant-banner',
        icon: 'assets/widgets/text-twirl.png',
        description: 'The following widget can be used to show one full width banner. The widget contains images.',
    }, {
        title: 'Vibrant Video Banner',
        type: 'vibrant-video-banner',
        icon: 'assets/widgets/text-twirl.png',
        description: 'The following widget can be used to show one full width banner with videos. The widget contains images and video links.',
    }, {
        title: 'Key Points',
        type: 'key-points-grid',
        icon: 'assets/widgets/text-twirl.png',
        description: 'The following widget can be used to show limited set of medias with title and description. The widget contains images.',
    }, {
        title: 'Modern Carousel',
        type: 'modern-carousel',
        icon: 'assets/widgets/text-twirl.png',
        description: 'The following widget can be used to show limited set of medias with title and description. The widget contains images.',
    }, {
        title: 'Clickpulse Panel',
        type: 'clickpulse-panel',
        icon: 'assets/widgets/clickpulse-panel.png',
        description: 'The following widget can be used to show limited set of medias with title and description. The widget contains images.',
    },
    {
        title: 'Stock Viewer',
        type: 'stock-viewer',
        icon: 'assets/widgets/stock-viewer.png',
        description: 'The following widget can be used to show categories and number of products in each category.',
    },
    {
        title: 'Custom 1',
        type: 'custom-1',
        icon: 'assets/widgets/custom-1.jpg',
        description: '<svg height="16" width="16" style="display: inline; margin-right: 4px; vertical-align: text-bottom;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0d6efd"><circle cx="12" cy="12" r="10" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4m0-4h.01"/></svg><em>Only available for certain projects.</em><br><br>Custom widget 1 - A customizable widget for displaying content with personalized layouts and styles.',
    },
    {
        title: 'Custom 2',
        type: 'custom-2',
        icon: 'assets/widgets/custom-2.jpg',
        description: '<svg height="16" width="16" style="display: inline; margin-right: 4px; vertical-align: text-bottom;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0d6efd"><circle cx="12" cy="12" r="10" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4m0-4h.01"/></svg><em>Only available for certain projects.</em><br><br>Custom widget 2 - A flexible widget that can be adapted for various display purposes.',
    },
    {
        title: 'Custom 3',
        type: 'custom-3',
        icon: 'assets/widgets/custom-3.jpg',
        description: '<svg height="16" width="16" style="display: inline; margin-right: 4px; vertical-align: text-bottom;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0d6efd"><circle cx="12" cy="12" r="10" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4m0-4h.01"/></svg><em>Only available for certain projects.</em><br><br>Custom widget 3 - A versatile widget for showcasing custom content and media.',
    },
    {
        title: 'Custom 4',
        type: 'custom-4',
        icon: 'assets/widgets/custom-4.jpg',
        description: '<svg height="16" width="16" style="display: inline; margin-right: 4px; vertical-align: text-bottom;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0d6efd"><circle cx="12" cy="12" r="10" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4m0-4h.01"/></svg><em>Only available for certain projects.</em><br><br>Custom widget 4 - A configurable widget designed for unique presentation needs.',
    },
    {
        title: 'Custom 5',
        type: 'custom-5',
        icon: 'assets/widgets/custom-5.jpg',
        description: '<svg height="16" width="16" style="display: inline; margin-right: 4px; vertical-align: text-bottom;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0d6efd"><circle cx="12" cy="12" r="10" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4m0-4h.01"/></svg><em>Only available for certain projects.</em><br><br>Custom widget 5 - A customizable display widget with advanced styling options.',
    },
    {
        title: 'Custom 6',
        type: 'custom-6',
        icon: 'assets/widgets/custom-6.jpg',
        description: '<svg height="16" width="16" style="display: inline; margin-right: 4px; vertical-align: text-bottom;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0d6efd"><circle cx="12" cy="12" r="10" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4m0-4h.01"/></svg><em>Only available for certain projects.</em><br><br>Custom widget 6 - A flexible layout widget for personalized content presentation.',
    },
    {
        title: 'Custom 7',
        type: 'custom-7',
        icon: 'assets/widgets/custom-7.jpg',
        description: '<svg height="16" width="16" style="display: inline; margin-right: 4px; vertical-align: text-bottom;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0d6efd"><circle cx="12" cy="12" r="10" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4m0-4h.01"/></svg><em>Only available for certain projects.</em><br><br>Custom widget 7 - A dynamic widget for creating custom display sections.',
    },
    {
        title: 'Custom 8',
        type: 'custom-8',
        icon: 'assets/widgets/custom-8.jpg',
        description: '<svg height="16" width="16" style="display: inline; margin-right: 4px; vertical-align: text-bottom;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0d6efd"><circle cx="12" cy="12" r="10" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4m0-4h.01"/></svg><em>Only available for certain projects.</em><br><br>Custom widget 8 - An adaptable widget with customizable features and layouts.',
    },
    {
        title: 'Custom 9',
        type: 'custom-9',
        icon: 'assets/widgets/custom-9.jpg',
        description: '<svg height="16" width="16" style="display: inline; margin-right: 4px; vertical-align: text-bottom;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0d6efd"><circle cx="12" cy="12" r="10" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4m0-4h.01"/></svg><em>Only available for certain projects.</em><br><br>Custom widget 9 - A versatile widget for displaying tailored content arrangements.',
    },
    {
        title: 'Custom 10',
        type: 'custom-10',
        icon: 'assets/widgets/custom-10.jpg',
        description: '<svg height="16" width="16" style="display: inline; margin-right: 4px; vertical-align: text-bottom;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#0d6efd"><circle cx="12" cy="12" r="10" stroke-width="1.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4m0-4h.01"/></svg><em>Only available for certain projects.</em><br><br>Custom widget 10 - A configurable widget for custom content display and organization.',
    }

];