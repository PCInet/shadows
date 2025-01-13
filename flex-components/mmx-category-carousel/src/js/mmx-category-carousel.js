/**
 * MMX / CATEGORY CAROUSEL
 */
class MMXPCINET_CategoryCarousel extends MMXPCINET_Element {

	static get props() {
		let props = MMXPCINET.assign(MMXPCINET_CategoryCarousel.carouselProps, MMXPCINET_HeroSlider.props);
		props['gap'].default = 32;
		props['per-page'].default = '1,3,5';
		props['arrow-style'].default = 'button';
		props['nav-position'].default = 'none';
		props['wrap'].default = false;
		props['autoplay'].default = false;
		return props;
	}

	static carouselProps = {
		'fallback-image': {
			allowAny: true
		},
		'image-fit': {
				allowAny: true,
				options: [
					'cover',
					'contain',
					'fill',
					'none',
					'scale-down'
				],
			default: 'contain'
		},
		'image-radius': {
			isNumeric: true,
			allowAny: true,
			default: 0
		}
	};

	styleResourceCodes = ['mmx-pcinet-base', 'mmx-pcinet-button', 'mmx-pcinet-hero', 'mmx-pcinet-hero-slider'];
	loadedCategories = {};

	constructor() {
		super();
		this.makeShadow();
		this.bindRevealElement();
	}

	render() {
		return /*html*/`
			<div part="wrapper" class="mmx-pcinet-category-carousel">
				<div part="title" class="mmx-pcinet-category-carousel__title">
					<slot name="title"></slot>
				</div>
				${this.renderCategories()}
			</div>
		`;
	}

	afterRender() {
		this.images().forEach(image => {
			this.applyShapeToImageContainer(image, this.data?.category_group?.image_shape?.value);
		});
	}

	styles() {
		return /*css*/`
			mmx-pcinet-button::part(button) {
				box-shadow: 0px 1px 3px 0px rgba(47, 43, 67, 0.10), 0px -1px 0px 0px rgba(47, 43, 67, 0.10) inset;
			}
		`;
	}

	onDataChange() {
		this.loadCategories();

		MMXPCINET.setElementAttributes(this, {
			'data-per-page': this.data?.advanced?.slide_controls?.per_page?.value,
			'data-per-move': this.data?.advanced?.slide_controls?.per_move?.value,
			'data-peek': this.data?.advanced?.slide_controls?.peek?.value,
			'data-size': this.data?.category_group?.image_size?.value,
			'data-image-fit': this.data?.category_group?.image_fit?.value,
			'data-image-radius': this.data?.category_group?.image_radius?.value
		});
	}

	getCategoryCodesToLoad() {
		const children = this?.data?.category_group?.categories?.children;

		if (!children?.length) {
			return;
		}

		return children.reduce((codes, child) => {
			const code = child?.category?.category?.code;
			if (!MMXPCINET.valueIsEmpty(code) && codes.indexOf(code) === -1 && MMXPCINET.isTruthy(child?.image?.category_image?.settings?.enabled)) {
				codes.push(code);
			}
			return codes;
		}, []);
	}

	loadCategories() {
		const categoryCodes = this.getCategoryCodesToLoad();

		if (!categoryCodes?.length) {
			return;
		}

		MMXPCINET.Runtime_JSON_API_Call({
			params: {
				function: 'Runtime_CategoryList_Load_Query',
				filter: [
					{
						name: 'search',
						value: [
							{
								field: 'code',
								operator: 'IN',
								value: categoryCodes
							}
						]
					},
					{
						name: 'ondemandcolumns',
						value: [
							'CustomField_Values:cmp-cssui-cattitle:category_title_image',
							'CustomField_Values:cmp-cssui-cattree:category_tree_image'
						]
					}
				]
			}
		})
		.then(response => {
			if(!response?.data?.data?.length) {
				return;
			}

			response.data.data.forEach(category => {
				this.loadedCategories[category.id] = category;
			});

			this.forceUpdate();
		})
		.catch(response => {});
	}

	renderCategories() {
		const children = MMXPCINET.copy(this?.data?.category_group?.categories?.children || []);

		if (!children?.length){
			return '';
		}

		return /*html*/`
			<mmx-pcinet-hero-slider
				part="slider"
				data-per-page="${this.getPropValue('per-page')}"
				data-per-move="${this.getPropValue('per-move')}"
				data-peek="${this.getPropValue('peek')}"
				data-gap="${this.getPropValue('gap')}"
				data-size="${this.getPropValue('size')}"
				data-autoplay="${this.getPropValue('autoplay')}"
				data-delay="${this.getPropValue('delay')}"
				data-pause-on-hover="${this.getPropValue('pause-on-hover')}"
				data-arrow-style="${this.getPropValue('arrow-style')}"
				data-nav-position="${this.getPropValue('nav-position')}"
				data-wrap="${this.getPropValue('wrap')}"
			>
				${children.map(child => this.renderCategory(child)).join('')}
			</mmx-pcinet-hero-slider>
		`;
	}

	renderCategory(child) {
		// Skip unavailable/inactive categories
		if(!child?.category?.category?.id) {
			return '';
		}

		return /*html*/`
			<mmx-pcinet-hero
				slot="hero_slide"
				part="hero_slide"
				data-fit="${MMXPCINET.encodeEntities(this.getPropValue('image-fit'))}"
				data-href="${MMXPCINET.encodeEntities(child.category.category.link)}"
			>
				${this.renderCategoryImage(child)}
				<mmx-pcinet-text
					slot="heading"
					part="hero_slide__heading"
					data-style="${this.data?.text_styles?.category_name?.style?.value ?? ''}"
					data-align="${this.data?.text_styles?.align?.value ?? ''}"
					style="
						font-family: ${MMXPCINET.encodeEntities(this.data?.text_styles?.category_name?.font_family?.value ?? '')};
						font-size: ${this.data?.text_styles?.category_name?.font_size?.value ?? ''}px;
						font-weight: ${this.data?.text_styles?.category_name?.font_weight?.value ?? ''};
						color: ${this.data?.text_styles?.category_name?.font_color?.value ?? ''};
						--mmx-pcinet-text--font-size-desktop: ${this.data?.text_styles?.category_name?.font_size?.value ?? ''}px;
						--mmx-pcinet-text--font-size-mobile: ${this.data?.text_styles?.category_name?.font_size_mobile?.value ?? ''}px;
						--mmx-pcinet-text--font-size-tablet: ${this.data?.text_styles?.category_name?.font_size_tablet?.value ?? ''}px;
						line-height: ${this.data?.text_styles?.category_name?.line_height?.value ?? ''}px;
						letter-spacing: ${this.data?.text_styles?.category_name?.letter_spacing?.value ?? ''}px;
						padding: ${this.data?.text_styles?.category_name?.padding?.value ?? ''}px;
						margin: ${this.data?.text_styles?.category_name?.margin?.value ?? ''}px;
					"
				>
					${child.category.category.name}
				</mmx-pcinet-text>

				${this.renderCategoryButton()}
			</mmx-pcinet-hero>
		`;
	}

	renderCategoryImage(child) {
		let mobileSource = '';
		let tabletSource = '';

		child.image.url = this.getPropValue('fallback-image');

		// Custom Images
		if (MMXPCINET.isTruthy(child?.image?.custom_image?.settings?.enabled) && child?.image?.custom_image?.image?.image?.length ) {
			child.image.url = child.image.custom_image.image.image;

			if (child?.image?.custom_image?.image?.responsive_images?.mobile) {
				mobileSource = /*html*/`<source class="source__mobile" media="(max-width: 39.999em)" srcset="${MMXPCINET.encodeEntities(MMXPCINET.encodeSrcset(child.image.custom_image.image.responsive_images.mobile))}">`;
			}

			if (child?.image?.custom_image?.image?.responsive_images?.tablet) {
				tabletSource = /*html*/`<source class="source__tablet" media="(max-width: 59.999em)" srcset="${MMXPCINET.encodeEntities(MMXPCINET.encodeSrcset(child.image.custom_image.image.responsive_images.tablet))}">`;
			}
		}
		// Category Image (tree or title)
		else if (MMXPCINET.isTruthy(child?.image?.category_image?.settings?.enabled)) {
			const loadedCategory = this.loadedCategories[child.category.category.id];
			if (child?.image?.category_image?.image?.value === 'cattitle' && loadedCategory?.CustomField_Values?.['cmp-cssui-cattitle']?.category_title_image?.length) {
				child.image.url = loadedCategory.CustomField_Values['cmp-cssui-cattitle'].category_title_image;
			}
			else if (child?.image?.category_image?.image?.value === 'cattree' && loadedCategory?.CustomField_Values?.['cmp-cssui-cattree']?.category_tree_image?.length) {
				child.image.url = loadedCategory.CustomField_Values['cmp-cssui-cattree'].category_tree_image;
			}
		}

		if(!child.image.url?.length) {
			return '';
		}

		return /*html*/`
			<picture
				slot="image"
				part="hero_slide__image"
			>
				${mobileSource}
				${tabletSource}
				<img 
					src="${child.image.url}"
					alt="${child.image?.custom_image?.image?.alt ?? ''}"
					style="border-radius: ${this.getPropValue('image-radius')}px;"
					${this.getLoadingAttributeString()}
				>
			</picture>
		`;
	}

	renderCategoryButton() {
		if (!this.data?.text_styles?.category_button?.settings?.enabled) {
			return '';
		}

		return /*html*/`
			<mmx-pcinet-button
				slot="button"
				part="hero_slide__button"
				data-style="${this.data?.text_styles?.category_button?.button?.button_style?.value ?? ''}"
				data-size="${this.data?.text_styles?.category_button?.button?.button_size?.value ?? ''}"
				data-styles="
					${MMXPCINET.encodeEntities(this.data?.text_styles?.category_button?.button?.textsettings?.styles?.normal ?? '')}
					${MMXPCINET.encodeEntities(this.data?.text_styles?.category_button?.button?.textsettings?.styles?.tablet ?? '')}
					${MMXPCINET.encodeEntities(this.data?.text_styles?.category_button?.button?.textsettings?.styles?.mobile ?? '')}
					${MMXPCINET.encodeEntities(this.data?.text_styles?.category_button?.button?.textsettings?.styles?.hover ?? '')}
					${MMXPCINET.encodeEntities(this.data?.text_styles?.category_button?.button?.textsettings?.styles?.disabled ?? '')}
				"
				style="
					display: flex;
					justify-content: ${{
						left: 'flex-start',
						center: 'center',
						right: 'flex-end'
					}[this.data?.text_styles?.align?.value]};
				"
			>
				${this.data?.text_styles?.category_button?.button?.value ?? ''}
			</mmx-pcinet-button>
		`;
	}

	slider() {
		return this.shadowRoot.querySelector('[part~="slider"]');
	}

	images() {
		return this.shadowRoot.querySelectorAll('[part~="hero_slide__image"]');
	}

	applyShapeToImageContainer(container, shape) {
    const shapes = {
        pentagon: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
				hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
        triangle: 'polygon(50% 0%, 100% 100%, 0% 100%)',
        circle: 'circle(50% at 50% 50%)'
    };

		container.style.clipPath = shapes[shape];
}

	revealElement(element) {
		this.slider()?.revealElement(element);
	}
}

if (!customElements.get('mmx-pcinet-category-carousel')) {
	customElements.define('mmx-pcinet-category-carousel', MMXPCINET_CategoryCarousel);
}