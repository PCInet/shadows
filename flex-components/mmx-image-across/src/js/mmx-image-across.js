/**
 * MMX / IMAGE ACROSS
 */
class MMXPCINET_ImageAcross extends MMXPCINET_Element {
	#auto_image_height;
	#scroll_position;
	#resize_observer;
	#intersection_observer;
	#left_arrow_disabled;
	#right_arrow_disabled;

	static get props() {
		return {
			align: {
				options: [
					'left',
					'center',
					'right'
				],
				default: 'center'
			},
			size: {
				options: [
					'auto',
					's',
					'm',
					'l'
				],
				allowAny: true,
				default: 'auto'
			},
			images: {
				allowAny: true,
				default: null
			},
			columns: {
				options: [
					'auto',
					'1',
					'2',
					'3',
					'4',
					'5',
					'6',
					'7',
					'8'
				],
				allowAny: true,
				default: 'auto',
				max: 8
			},
			overflow: {
				options: [
					'scroll',
					'wrap'
				],
				default: 'scroll'
			},
		};
	}

	styleResourceCodes = ['mmx-pcinet-base', 'mmx-pcinet-button', 'mmx-pcinet-hero', 'mmx-pcinet-image-across'];

	constructor() {
		super();
		this.makeShadow();
		this.#scroll_position		= 0;
		this.#resize_observer		= new ResizeObserver(entries => this.setScrollPosition());
		this.#intersection_observer	= new IntersectionObserver(entries => {
			
			this.calculateScrollPosition();
			this.handleScrollControls();
		}, { rootMargin: '100% 0%', threshold: 0 });
	}

	render() {
		return /*html*/`
			<div part="wrapper" class="mmx-pcinet-image-across">
				<div part="title" class="mmx-pcinet-image-across__title">
					<slot name="title"></slot>
				</div>
				<div part="content" class="mmx-pcinet-image-across__content">
					<div part="images" class="mmx-pcinet-image-across__images mmx-pcinet-image-across__images-columns--${this.maxColumns()} mmx-pcinet-image-across__images-overflow--${this.getPropValue('overflow')}">
						${this.renderImages()}
						<slot name="image"></slot>
					</div>
					<div part="controls" class="mmx-pcinet-image-across__controls">
						<span part="arrow-left" class="mmx-pcinet-image-across__arrow mmx-pcinet-image-across__arrow--prev mmx-pcinet-image-across__arrow--disabled">
							<mmx-pcinet-icon data-color="white" data-size="12px">chevron-left</mmx-pcinet-icon>
						</span>
						<span part="arrow-right" class="mmx-pcinet-image-across__arrow mmx-pcinet-image-across__arrow--next">
							<mmx-pcinet-icon data-color="white" data-size="12px">chevron-right</mmx-pcinet-icon>
						</span>
					</div>
				</div>
			</div>
		`;
	}

	afterRender() {
		this.setImageHeight();
		this.#resize_observer.observe(this.shadowImagesContainer());
		this.slottedImages().forEach(image => {this.#intersection_observer.observe(image);});
		this.hideScrollbar();
		this.bindEvents();
	}

	styles() {
		return /*css*/`
			:host {
				--mmx-pcinet-image-across__text-align: ${this.getPropValue('align')};
				--mmx-pcinet-image-across__columns: ${this.maxColumns()};
				--mmx-pcinet-image-across__image-count: ${this.getImageCount()};
			}
		`;
	}

	bindEvents() {
		this.arrowLeft().addEventListener('click', this.scrollLeft.bind(this));
		this.arrowRight().addEventListener('click', this.scrollRight.bind(this));
	}

	images() {
		return this.loadPropertyData('images') || [];
	}

	arrowLeft() {
		return this.shadowRoot.querySelector('[part="arrow-left"]');
	}

	arrowRight() {
		return this.shadowRoot.querySelector('[part="arrow-right"]');
	}

	slottedImages() {
		return this.querySelectorAll(':scope > [slot="image"]');
	}

	shadowImages() {
		return this.shadowRoot.querySelectorAll('[part="image"]');
	}

	shadowImagesContainer() {
		return this.shadowRoot.querySelector('[part="images"]');
	}

	imageElements() {
		return [...this.shadowImages(), ...this.slottedImages()];
	}

	renderImages() {
		return this.images().map((image => {
			return this.createElement({
				type: 'mmx-pcinet-hero',
				attributes: {
					part: 'image',
					...image
				}
			}).outerHTML;
		})).join('');
	}

	getImageCount() {
		const slottedImageCount = this.slottedImages().length;
		return this.images().length + slottedImageCount;
	}

	maxColumns() {
		const columns = this.getPropValue('columns');

		if (columns !== 'auto') {
			return isNaN(columns) ? columns : Number(columns);
		}

		const imageCount = this.getImageCount();
		if (imageCount < this.constructor.props.columns.max) {
			return imageCount;
		}

		return this.constructor.props.columns.max;
	}

	getSize() {
		const size = this.getPropValue('size');
		if (size === 'auto') {
			return this.#auto_image_height + 'px';
		} else {
			return size;
		}
	}

	hideScrollbar() {
		const container = this.shadowImagesContainer();
		const isScrollable = container.scrollWidth > container.clientWidth;

		if (isScrollable) {
			// Adjust margin to hide scrollbar
			container.style.marginBottom = -(container.offsetHeight - container.clientHeight) + 'px';
		} else {
			// Reset margin if not scrollable
			container.style.marginBottom = '0px';
		}
	}

	setImageHeight() {
		if (this.getPropValue('size') !== 'auto') {
			return this.updateImageHeight(this.getPropValue('size'));
		}

		this.#auto_image_height = 0;
		this.imageLoadedCount = 0;

		this.imageElements().forEach(image => {
			const img = image?.slottedImage?.() ?? image?.shadowImage?.();

			if (img?.complete) {
				return this.checkLoadedImage(img);
			}

			image.addEventListener('img:load', this.#event_image_load);
		});
	}

	#event_image_load = (e) => {
		this.checkLoadedImage(e.detail.element);
	};

	checkLoadedImage(image) {
		const last_auto_image_height = this.#auto_image_height;

		this.imageLoadedCount++;

		this.calculateMinImageHeight(this.getResponsiveImageHeight(image));

		if (last_auto_image_height !== this.#auto_image_height) {
			this.updateImageHeight(this.#auto_image_height + 'px');
		}
	}

	updateImageHeight(size) {
		this.imageElements().forEach(image => {
			image.setAttribute('data-size', size);
		});
	}

	calculateMinImageHeight(height)
	{
		if (this.#auto_image_height === 0) {
			this.#auto_image_height = height;
		}
		else if (height < this.#auto_image_height) {
			this.#auto_image_height = height;
		}
	}

	handleScrollControls() {
		const container = this.shadowImagesContainer();
		const scrollLeft = container.scrollLeft;
		const maxScrollLeft = container.scrollWidth - container.clientWidth;
		const peek = 50;

		const arrowLeft = this.arrowLeft();
		const arrowRight = this.arrowRight();

		
		// Check if the container is scrollable
		if (maxScrollLeft <= 0) {
				// Hide both arrows if no scrolling is possible
				arrowLeft.style.display = 'none';
				arrowRight.style.display = 'none';
				return;
		} else {
				// Show arrows if scrolling is possible
				arrowLeft.style.display = '';
				arrowRight.style.display = '';
		}

		// Disable the left arrow if at the start
		if (scrollLeft <= peek) {
			if (!this.#left_arrow_disabled) {
				arrowLeft.classList.add('mmx-pcinet-image-across__arrow--disabled');
				arrowLeft.setAttribute('aria-disabled', 'true');
				this.#left_arrow_disabled = true;
			}
		} else {
			if (this.#left_arrow_disabled) {
				arrowLeft.classList.remove('mmx-pcinet-image-across__arrow--disabled');
				arrowLeft.removeAttribute('aria-disabled');
				this.#left_arrow_disabled = false;
			}
		}

		// Disable the right arrow if at the end
		if (scrollLeft >= maxScrollLeft - peek) {
			if (!this.#right_arrow_disabled) {
				arrowRight.classList.add('mmx-pcinet-image-across__arrow--disabled');
				arrowRight.setAttribute('aria-disabled', 'true');
				this.#right_arrow_disabled = true;
			}
		} else {
			if (this.#right_arrow_disabled) {
				arrowRight.classList.remove('mmx-pcinet-image-across__arrow--disabled');
				arrowRight.removeAttribute('aria-disabled');
				this.#right_arrow_disabled = false;
			}
		}
	}

	scrollLeft() {
		const image_width = this.slottedImages()?.[0]?.offsetWidth;

		this.shadowImagesContainer().scroll({behavior: 'smooth', left: this.shadowImagesContainer().scrollLeft - image_width || 0});
	}

	scrollRight() {
		const image_width = this.slottedImages()?.[0]?.offsetWidth;

		this.shadowImagesContainer().scroll({behavior: 'smooth', left: this.shadowImagesContainer().scrollLeft + image_width || 0});
	}

	calculateScrollPosition()
	{
		const image_container	= this.shadowImagesContainer().scrollWidth;
		const image_position	= this.shadowImagesContainer().scrollLeft;
		const position_percent	= image_position / image_container;

		this.#scroll_position = position_percent;
	}

	setScrollPosition()
	{
		const image_container	= this.shadowImagesContainer().scrollWidth;
		const new_position 		= this.#scroll_position * image_container;

		this.shadowImagesContainer().scrollLeft	= new_position;
	}

	onDataChange() {
		MMXPCINET.setElementAttributes(this, {});
	}
}

if (!customElements.get('mmx-pcinet-image-across')){
	customElements.define('mmx-pcinet-image-across', MMXPCINET_ImageAcross);
}