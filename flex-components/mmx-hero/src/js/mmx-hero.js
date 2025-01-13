/**
 * MMX PCINET / HERO
 */
class MMXPCINET_Hero extends MMXPCINET_Element {

	static get props() {
		return {
			align: {
				options: [
					'left',
					'center',
					'right'
				],
				default: 'left'
			},
			'content-location': {
				options: [
					'top-left',
					'top-center',
					'top-right',
					'center-left',
					'center',
					'center-right',
					'bottom-left',
					'bottom-center',
					'bottom-right',
					'under',
					'above',
					'left',
					'right'
				],
				default: 'under'
			},
			'content-layout': {
				options: [
					'hero',
					'horizontal-banner',
					'vertical-banner',
					'text-area',
					'video'
				],
				default: 'hero'
			},
			size: {
				options: [
					// Preset Design System Sizes
					's',
					'm',
					'l',

					// Ratios
					'1/1',
					'4/3',
					'5/6',
					'16/9',

					// Dimensions i.e. [max-width]x[max-height]
					'600x500',
					'1600x900',
					'900x1600',

					// Height (max-height)
					'400px',
					'30rem',
					'50vh',

					// Size to Length of Content
					'content',

					// Auto Size To Slotted Image
					'auto'
				],
				default: 'auto',
				allowAny: true
			},
			padding: {
				options: [
					'auto',
					'none',
					's',
					'm',
					'l'
				],
				default: 'auto'
			},
			href: {
				default: null,
				allowAny: true
			},
			target: {
				default: null,
				allowAny: true
			},
			'overlay-bg': {
				options: [
					'linear-gradient',
					'radial-gradient',
					'color',
					'opacity',
					'none'
				],
				default: 'none',
				allowAny: true
			},
			'overlay-bg-opacity': {
				allowAny: true,
				default: null
			},
			'overlay-bg-angle': {
				options: [
					'0deg',
					'45deg',
					'90deg',
					'135deg',
					'180deg',
					'225deg',
					'270deg',
					'315deg'
				],
				default: '45deg',
				allowAny: true
			},
			'overlay-bg-color': {
				options: [
					'rgba(0, 0, 0, 0.5)',
					'rgba(255, 255, 255, 0.5)'
				],
				default: 'rgba(0, 0, 0, 0.5)',
				allowAny: true
			},
			'overlay-bg-to-color': {
				options: [
					'rgba(0, 0, 0, 0)',
					'rgba(255, 255, 255, 0)'
				],
				default: 'rgba(0, 0, 0, 0)',
				allowAny: true
			},
			'content-width': {
				options: [
					'auto',
					'default',
					'wide',
					'extra-wide',
					'20%',
					'30%',
					'40%',
					'50%',
					'60%',
					'70%',
					'80%'
				],
				default: 'auto',
				isPercentage: true,
				allowAny: true
			},
			'content-height': {
				options: [
					'auto',
					'50%',
					'75%',
					'100%'
				],
				default: 'auto',
				isPercentage: true,
				allowAny: true
			},
			'content-bg-color--mobile': {
				options: [
					'none',
					'white',
					'black'
				],
				default: 'none',
				allowAny: true
			},
			'content-bg-color--desktop': {
				options: [
					'none',
					'white',
					'black'
				],
				default: 'none',
				allowAny: true
			},
			'content-bg-border-radius': {
				allowAny: true,
				default: '0'
			},
			'content-theme': {
				options: [
					'light',
					'dark',
					'dark--l',
					'invert'
				],
				default: 'light'
			},
			fit: {
				options: [
					'cover',
					'contain',
					'fill',
					'none',
					'scale-down'
				],
				default: 'cover'
			},
			heading: {
				allowAny: true,
				default: null
			},
			'heading-style': {
				options: [
					'display-1',
					'display-2',
					'display-3',
					'title-1',
					'title-2',
					'title-3',
					'title-4',
					'subheading-l',
					'subheading-s'
				],
				default: 'title-2'
			},
			'heading-tag': {
				options: [
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6',
					'p'
				],
				default: 'p'
			},
			body: {
				allowAny: true,
				default: null
			},
			'body-style': {
				options: [
					'paragraph-l',
					'paragraph-s',
					'paragraph-xs'
				],
				default: 'paragraph-s'
			},
			subheading: {
				allowAny: true,
				default: null
			},
			'subheading-style': {
				options: [
					'subheading-l',
					'subheading-s'
				],
				default: 'subheading-s'
			},
			button: {
				allowAny: true,
				default: null
			},
			'button-style': {
				options: ['primary', 'secondary', 'display-link', 'primary-link', 'secondary-link', 'dark-primary', 'dark-secondary', 'dark-display-link', 'dark-primary-link', 'dark-secondary-link'],
				default: 'primary'
			},
			'button-size': {
				options: ['xs', 's', 'm', 'l'],
				default: 'm'
			},
			'img-src': {
				allowAny: true,
				default: null
			},
			'img-alt': {
				allowAny: true,
				default: null
			},
			badges: {
				allowAny: true,
				isJson: true,
				default: []
			}
		};
	}

	styleResourceCodes = ['mmx-pcinet-base', 'mmx-pcinet-text', 'mmx-pcinet-button', 'mmx-pcinet-hero'];
	renderUniquely = true;

	constructor() {
		super();
		this.makeShadow();
	}

	render() {
		const contentStyle = this.showHideContent() ? '' : 'none';
		return /*html*/`
			<a
				part="wrapper theme-${this.getPropValue('content-theme')}"
				${this.renderHref()}
				${this.renderTarget()}
				class="
					mmx-pcinet-hero
					mmx-pcinet-hero--size-method--${this.getSizeMethod()}
					mmx-pcinet-hero--size--${this.getPropValue('size')}
					mmx-pcinet-hero--content-${this.contentLocationCategory()}
					mmx-pcinet-hero--layout-${this.getPropValue('content-layout')}
					mmx-pcinet-hero--padding-${this.getPropValue('padding')}
					${this.getContentBgClasses()}
					${this.getThemeClass()}
				"
			>
				<div part="image-container" class="mmx-pcinet-hero__image-container">
					${this.renderBadges()}
					${this.renderImage()}
					<slot name="image"></slot>
				</div>
				<div part="content-bg" class="mmx-pcinet-hero__content-bg mmx-pcinet-hero__content-bg--${this.getPropValue('content-location')}">
					<div part="content-wrapper" class="mmx-pcinet-hero__content-wrapper">
						<div part="content" class="mmx-pcinet-hero__content" style="display: ${contentStyle};">
							<div part="rendered-content" class="mmx-pcinet-hero__rendered-content">${this.renderContent()}</div>
							<slot name="content"></slot>
							<div class="mmx-pcinet-hero__individual-content">${this.renderIndividualSlots()}</div>
						</div>
					</div>
				</div>
			</a>
		`;
	}

	afterRender() {
		this.showHideContent();
		this.bindEvents();
	}

	styles() {
		return /*css*/`
			:host {
				--mmx-pcinet-hero__max-width: ${this.getMaxWidth()};
				--mmx-pcinet-hero__aspect-ratio: ${this.getAspectRatio()};
				--mmx-pcinet-hero__content-bg-color--desktop: ${this.getPropValue('content-bg-color--desktop')};
				--mmx-pcinet-hero__content-bg-color--mobile: ${this.getPropValue('content-bg-color--mobile')};
				--mmx-pcinet-hero__content-bg-border-radius: ${this.getPropValue('content-bg-border-radius')}px;
				--mmx-pcinet-hero__content-height: ${this.getPropValue('content-height')};
				--mmx-pcinet-hero__content-width: ${this.getContentWidth()};
				--mmx-pcinet-hero__grid-template-columns: ${this.getGridTemplateColumns()};
				--mmx-pcinet-hero__max-height: ${this.getMaxHeight()};
				--mmx-pcinet-hero__object-fit: ${this.getPropValue('fit')};
				--mmx-pcinet-hero__overlay-bg: ${this.getOverlayBg()};
				--mmx-pcinet-hero__text-align: ${this.getPropValue('align')};
			}

			${this.renderIframeObjectFitStyles()}
		`;
	}

	renderHref() {
		const href = this.getPropValue('href');
		return href ? `href="${MMXPCINET.encodeEntities(href)}"` : '';
	}

	renderTarget() {
		const target = this.getPropValue('target');
		return target ? `target="${MMXPCINET.encodeEntities(target)}"` : '';
	}

	slottedImage() {
		return this.querySelector(':scope > img[slot="image"], :scope > [slot="image"] > img');
	}

	shadowImage() {
		return this.shadowRoot.querySelector('img');
	}

	slottedContent() {
		return this.querySelectorAll(`:scope > [slot="content"],
									  :scope > [slot="subheading"],
									  :scope > [slot="heading"],
									  :scope > [slot="body"],
									  :scope > [slot="button"]
									`);
	}

	hasSlottedContent() {
		return this.slottedContent()?.length > 0;
	}

	renderedContent() {
		return this.shadowRoot.querySelector('.mmx-pcinet-hero__rendered-content');
	}

	showHideContent() {
		const content = this.shadowRoot.querySelector('.mmx-pcinet-hero__content');

		// Show Hide Content Based on Data Settings
		if ([0, false, 'false'].includes(this.data?.content?.settings?.enabled)) {
			if (content) {
				content.style.display = 'none';
			}
			return false;
		}

		// Show Hide Content Based on if Content Exists
		const hasContent = this.hasSlottedContent() || this.renderedContent()?.textContent?.trim()?.length;
		if (hasContent) {
			if (content) {
				content.style.display = '';
			}
			return true;
		}

		if (content) {
			content.style.display = 'none';
		}
		return false;
	}

	getSizeMethod() {
		const size = this.getPropValue('size');

		// Handle content size
		if (size === 'content') {
			return size;
		}

		// Handle preset sizes
		if (['s', 'm', 'l'].includes(size)) {
			return 'preset';
		}

		// Handle aspect-ratio sizes
		if (size.indexOf('/') > -1 ) {
			return 'ratio';
		}

		// Handle width & height dimensions
		const dimensions = this.getSizeDimensions();
		if (dimensions?.width > 0 && dimensions?.height > 0) {
			return 'dimensions';
		}

		// Handle height dimension (100px, 10vh, etc.)
		if (/^\d/.test(size)) {
			return 'height';
		}

		// Default return
		return 'auto';
	}

	contentLocationCategory() {
		const contentLocation = this.getPropValue('content-location');

		if (['under', 'above'].includes(contentLocation)) {
			return `is-${contentLocation}-image`;
		}

		if (['left', 'right'].includes(contentLocation)) {
			return 'is-next-to-image';
		}

		return 'is-over-image';
	}

	getThemeClass() {
		const contentTheme = this.getPropValue('content-theme');
		let themeClass = `mmx-pcinet-hero--content-theme-${contentTheme}`;

		if (['dark', 'dark--l'].includes(contentTheme)) {
			themeClass += ' mmx-pcinet-theme--' + contentTheme;
		}

		return themeClass;
	}

	getSizeDimensions() {
		const size = this.getPropValue('size');
		const dimensionPattern = /(\d+)x(\d+)/;

		if (!dimensionPattern.test(size)) {
			return null;
		}

		const [fullMatch, width, height] = size.match(dimensionPattern);

		return {
			height: Number(height),
			width: Number(width)
		};
	}

	getMaxWidth() {
		const dimensions = this.getSizeDimensions();
		return dimensions?.width > 0 ? dimensions.width + 'px' : 'auto';
	}

	getMaxHeight() {
		const sizeMethod = this.getSizeMethod();
		const size = this.getPropValue('size');

		if (sizeMethod === 'ratio') {
			return 'auto';
		}

		if (sizeMethod === 'dimensions') {
			const dimensions = this.getSizeDimensions();
			return dimensions?.height + 'px';
		}

		if (sizeMethod === 'height') {
			return size;
		}

		return 'auto';
	}

	getAspectRatio() {
		const sizeMethod = this.getSizeMethod();
		const size = this.getPropValue('size');

		if (sizeMethod === 'dimensions') {
			const dimensions = this.getSizeDimensions();
			return dimensions.width + '/' + dimensions.height;
		}

		if (sizeMethod === 'ratio') {
			return size;
		}

		return 'auto';
	}

	getOverlayBg() {
		const overlayBg = this.getPropValue('overlay-bg');
		if (overlayBg === 'none' ) {
			return 'none';
		}
		else if (overlayBg === 'opacity' ) {
			const opacity = this.getPropValue('overlay-bg-opacity') / 100 || 0;
			return `rgba(0, 0, 0, ${opacity})`;
		}
		else if (overlayBg === 'color' ) {
			return this.getPropValue('overlay-bg-color');
		}
		else if (overlayBg === 'linear-gradient' ) {
			return `linear-gradient(${this.getPropValue('overlay-bg-angle')}, ${this.getPropValue('overlay-bg-color')}, ${this.getPropValue('overlay-bg-to-color')})`;
		}
		else if (overlayBg === 'radial-gradient' ) {
			return `radial-gradient(${this.getPropValue('overlay-bg-color')}, ${this.getPropValue('overlay-bg-to-color')})`;
		}

		return overlayBg;
	}

	contentWidthToPx = {
		'extra-wide': '1200px',
		wide: '1000px',
		default: '800px'
	};

	sizeToRatioMap = {
		s: '1440 / 400',
		m: '1440 / 580',
		l: '1440 / 740'
	};

	renderIframeObjectFitStyles() {
		const sizeMethod = this.getSizeMethod();
		const size = this.getPropValue('size');

		if (sizeMethod === 'preset') {
			const aspectRatio = this.sizeToRatioMap[size];
			const [width, height] = aspectRatio.split(' / ');
			return this.getIframeObjectFitStylesSizeIsPreset(width, height);
		}

		if (sizeMethod === 'dimensions') {
			const dimensions = this.getSizeDimensions();
			return this.getIframeObjectFitStylesSizeIsDimensions(dimensions.width, dimensions.height);
		}

		return '';

	}

	getIframeObjectFitStylesSizeIsPreset(width, height) {
		return /*css*/`
			@media (min-aspect-ratio: ${width} / ${height}) {
				.mmx-pcinet-hero {
					--mmx-pcinet-hero__iframe-height: calc(100vw * (${height} / ${width}));
				}
			}

			@media (max-aspect-ratio: ${width} / ${height}) {
				.mmx-pcinet-hero {
					--mmx-pcinet-hero__iframe-width: calc(100vw / (${height} / ${width}));
				}
			}
		`;
	}

	getIframeObjectFitStylesSizeIsDimensions(width, height) {
		return /*css*/`
			.mmx-pcinet-hero {
				--mmx-pcinet-hero__iframe-width: ${width};
				--mmx-pcinet-hero__iframe-height: ${height};
			}
		`;
	}

	getContentWidth() {
		const contentLocation = this.getPropValue('content-location');
		const contentWidth = this.getPropValue('content-width');

		if (['under', 'above'].includes(contentLocation) && contentWidth === 'auto') {
			return '100%';
		}

		if (['left', 'right'].includes(contentLocation) && contentWidth === 'auto') {
			return '35%';
		}

		if (contentWidth in this.contentWidthToPx) {
			return this.contentWidthToPx[contentWidth];
		}

		return contentWidth;
	}

	getGridTemplateColumns() {
		let columnsTemplate = ['auto', this.getContentWidth()];

		if (this.getPropValue('content-location') === 'left') {
			columnsTemplate.reverse();
		}

		return columnsTemplate.join(' ');
	}

	getContentBgClasses() {
		const hasContentBgColorOnDesktop = this.getPropValue('content-bg-color--desktop') !== 'none';
		const hasContentBgColorOnMobile = this.getPropValue('content-bg-color--mobile') !== 'none';

		let classes = [];
		classes.push(hasContentBgColorOnDesktop ? 'mmx-pcinet-hero--desktop-has-bg' : 'mmx-pcinet-hero--desktop-no-bg');
		classes.push(hasContentBgColorOnMobile ? 'mmx-pcinet-hero--mobile-has-bg' : 'mmx-pcinet-hero--mobile-no-bg');

		return classes.join(' ');
	}

	renderBadges() {
		const badges = JSON.parse(this.dataset.badges || '[]');

		if (!badges?.length) {
			return '';
		}

		return /*html*/`
			<div part="badges" class="mmx-pcinet-hero__badges">
				${badges.map((badge) => this.renderBadge(badge)).join('')}
			</div>
		`;
	}

	renderBadge(badge) {
		return /*html*/`
			<mmx-pcinet-badge>
				Test Badge
			</mmx-pcinet-badge>
		`;
	}

	renderImage() {
		if (this.slottedImage()) {
			return '';
		}

		if (this.data?.image) {
			return this.renderImageAsPicture();

		}
		return this.renderImageFromAttributes();
	}

	renderImageAsPicture() {
		if (typeof this.data?.image?.img?.image === 'undefined') {
			return '';
		}

		return /*html*/`
			<picture part="picture">
				${this.data?.image?.img?.responsive_images?.mobile ? /*html*/`<source class="source__mobile" media="(max-width: 39.999em)" srcset="${MMXPCINET.encodeEntities(MMXPCINET.encodeSrcset(this.data.image.img.responsive_images.mobile))}">` : ''}
				${this.data?.image?.img?.responsive_images?.tablet ? /*html*/`<source class="source__tablet" media="(max-width: 59.999em)" srcset="${MMXPCINET.encodeEntities(MMXPCINET.encodeSrcset(this.data.image.img.responsive_images.tablet))}">` : ''}
				<img src="${this.data.image.img.image}" alt="${this.data?.image?.img?.alt || ''}" ${this.getLoadingAttributeString()}>
			</picture>
		`;
	}

	renderImageFromAttributes() {
		const imageAttributes = {
			...this.buildImageAttributeObject(),
			part: 'image'
		};

		if (!imageAttributes?.src?.length) {
			return '';
		}

		return this.createElement({
			type: 'img',
			attributes: imageAttributes
		}).outerHTML;
	}

	buildImageAttributeObject() {
		const imageAttributePrefix = 'data-img-';
		const attributeNames = this.getAttributeNames();

		let image = {
			alt: '',
			...this.getLoadingAttributes()
		};

		if (!attributeNames.length) {
			return image;
		}

		attributeNames.forEach((attributeName) => {
			if (attributeName.indexOf(imageAttributePrefix) !== 0) {
				return;
			}

			const imageAttributeName = attributeName.replace(imageAttributePrefix, '');
			image[imageAttributeName] = this.getAttribute(attributeName);
		}, []);

		return image;
	}

	renderIndividualSlots() {
		const individualSlots = ['subheading', 'heading', 'body', 'button'];
		return individualSlots.map((slot) => {
			return this.querySelector(`[slot="${slot}"]`) ? /*html*/`<slot name="${slot}"></slot>` : '';
		}).join('');
	}

	renderContent() {
		if (this.hasSlottedContent()) {
			return '';
		}
		return (
			this.renderSubheading() +
			this.renderHeading() +
			this.renderBody() +
			this.renderButton()
		).trim();
	}

	renderSubheading() {
		const subheading = this.getPropValue('subheading');
		if (!subheading) {
			return '';
		}
		return /*html*/`<mmx-pcinet-text part="subheading" data-style="${this.getPropValue('subheading-style')}">${subheading}</mmx-pcinet-text>`;
	}

	renderHeading() {
		const heading = this.getPropValue('heading');
		if (!heading) {
			return '';
		}
		return /*html*/`<mmx-pcinet-text part="heading" data-style="${this.getPropValue('heading-style')}" data-tag="${this.getPropValue('heading-tag')}" data-chars-per-line="none">${heading}</mmx-pcinet-text>`;
	}

	renderBody() {
		const body = this.getPropValue('body');

		if (!body) {
			return '';
		}
		return /*html*/`<mmx-pcinet-text part="body" data-style="${this.getPropValue('body-style')}" data-chars-per-line="55">${body}</mmx-pcinet-text>`;
	}

	renderButton() {
		const button = this.getPropValue('button');
		if (!button) {
			return '';
		}
		return /*html*/`<mmx-pcinet-button part="button" exportparts="button: button__inner" data-style="${this.getPropValue('button-style')}" data-size="${this.getPropValue('button-size')}">${button}</mmx-pcinet-button>`;
	}

	bindEvents() {
		this.bindLoad(this.slottedImage());
		this.bindLoad(this.shadowImage());
	}

	#event_image_load = (e) => {
		this.imageLoaded(e.currentTarget);
	};

	bindLoad(image) {
		if (!image) {
			return;
		}

		if (image.complete)	this.imageLoaded(image);
		else				image.addEventListener('load', this.#event_image_load);
	}

	imageLoaded(image) {
		const imgLoadEvent = new CustomEvent('img:load', {
			bubbles: true,
			cancelable: false,
			composed: true,
			detail: {
				element: image
			}
		});
		this.dispatchEvent(imgLoadEvent);
	}

	onDataChange() {
		this.setSpacing(this.data?.advanced?.spacing);
		MMXPCINET.setElementAttributes(this, {
			'data-href': this.data?.link?.url,
			'data-target': this.data?.link?.new_tab ? '_blank' : undefined,
			'data-size': this.data?.image?.size?.value,
			'data-content-width': this.data?.advanced?.desktop?.container_width?.value,
			'data-content-location': this.data?.content?.content_location?.value,
			'data-align': this.data?.content?.align?.value,
			'data-overlay-bg': 'opacity',
			'data-overlay-bg-opacity': this.data?.advanced?.desktop?.overlay_opacity?.value,
			'data-content-bg-color--mobile': this.data?.advanced?.mobile?.background_color?.settings?.enabled ? this.data?.advanced?.mobile?.background_color?.color?.value : undefined,
			'data-content-bg-color--desktop': this.data?.advanced?.desktop?.background_color?.settings?.enabled ? this.data?.advanced?.desktop?.background_color?.color?.value : undefined,
			'data-content-bg-border-radius': this.data?.advanced?.desktop?.background_color?.settings?.enabled ? this.data?.advanced?.desktop?.background_color?.border_radius?.value : undefined,
			'data-content-theme': this.data?.advanced?.content_theme?.value,
			'data-subheading': this.data?.content?.settings?.enabled ? this.data?.content?.subheading?.value : undefined,
			'data-subheading-style': this.data?.content?.settings?.enabled ? this.data?.content?.subheading?.textsettings?.fields?.normal?.subheading_style?.value : undefined,
			'data-heading': this.data?.content?.settings?.enabled ? this.data?.content?.heading?.value : undefined,
			'data-heading-style': this.data?.content?.settings?.enabled ? this.data?.content?.heading?.textsettings?.fields?.normal?.heading_style?.value : undefined,
			'data-heading-tag': this.data?.content?.settings?.enabled ? this.data?.content?.heading?.textsettings?.fields?.normal?.heading_tag?.value : undefined,
			'data-body': this.data?.content?.settings?.enabled ? this.data?.content?.body?.value : undefined,
			'data-body-style': this.data?.content?.settings?.enabled ? this.data?.content?.body?.textsettings?.fields?.normal?.body_style?.value : undefined,
			'data-button': this.data?.content?.settings?.enabled ? this.data?.content?.button?.value : undefined,
			'data-button-style': this.data?.content?.settings?.enabled ? this.data?.content?.button?.textsettings?.fields?.normal?.button_style?.value : undefined,
			'data-button-size': this.data?.content?.settings?.enabled ? this.data?.content?.button?.textsettings?.fields?.normal?.button_size?.value : undefined,
		});
	}
}

if (!customElements.get('mmx-pcinet-hero')) {
	customElements.define('mmx-pcinet-hero', MMXPCINET_Hero);
}