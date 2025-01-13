/**
 * MMX PCINET / CARD
 */
class MMXPCINET_Card extends MMXPCINET_Element {

	static get props() {
		return {
			href: {
				allowAny: true
			},
			target: {
				allowAny: true
			}
		};
	}

	styleResourceCodes = ['mmx-pcinet-base', 'mmx-pcinet-card'];
	renderUniquely = true;

	constructor() {
		super();
		this.makeShadow();
	}

	render() {
		return /*html*/`
			<a
				part="wrapper"
				class="mmx-pcinet-card"
				${this.#renderHref()}
				${this.#renderTarget()}
			>
				<slot name="flag" part="flag" class="mmx-pcinet-card__flag"></slot>
				<slot name="header" part="header" class="mmx-pcinet-card__header"></slot>
				<slot name="main" part="main" class="mmx-pcinet-card__main"></slot>
				<slot name="footer" part="footer" class="mmx-pcinet-card__footer"></slot>
			</a>
		`;
	}

	#renderHref() {
		const href = this.getPropValue('href');
		return typeof href === 'string' ? `href="${MMXPCINET.encodeEntities(href)}"` : '';
	}

	#renderTarget() {
		const target = this.getPropValue('target');
		return typeof target === 'string' ? `target="${MMXPCINET.encodeEntities(target)}"` : '';
	}
}

if (!customElements.get('mmx-pcinet-card')) {
	customElements.define('mmx-pcinet-card', MMXPCINET_Card);
}

/**
 * MMX PCINET / PRODUCT CARD
 */
class MMXPCINET_ProductCard extends MMXPCINET_Card {

	static get props() {
		return MMXPCINET.assign(MMXPCINET_ProductCard.productCardProps, MMXPCINET_Card.props);
	}

	static productCardProps = {
		'fallback-image': {
			allowAny: true,
			default: 'graphics/en-US/cssui/blank.gif'
		},
		'adpr-url': {
			allowAny: true,
			default:  MMXPCINET.longMerchantUrl({Screen: 'BASK'})
		},
		'atwl-url': {
			allowAny: true,
			default:  MMXPCINET.longMerchantUrl({Screen: 'WISH'})
		},
		'show-image': {
			isBoolean: true,
			default: true
		},
		'image-type': {
			allowAny: true,
			default: 'main'
		},
		'image-dimensions': {
			allowAny: true,
			default: '350x350'
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
		}
	};

	styleResourceCodes = ['mmx-pcinet-base', 'mmx-pcinet-text', 'mmx-pcinet-card'];
	renderUniquely = true;

	#product;
	#details = [
		{
			type: { value: 'name' }
		},
		{
			type: { value: 'price' },
			price: {
				displayed: {
					value: 'sale'
				},
				additional: {
					value: 'base'
				}
			}
		},
	];

	constructor() {
		super();
	}

	static create({product, details, ...options}) {
		return MMXPCINET.createElement({
			type: 'mmx-pcinet-product-card',
			data: {
				product,
				details
			},
			...options
		});
	}

	onDataChange() {
		this.#product = this.data?.product ?? this.#product;
		this.#details = this.data?.details ?? this.#details;
	}

	render() {
		if (!this.#product) {
			return '';
		}

		return /*html*/`
			<mmx-pcinet-card
				part="wrapper"
				exportparts="card-wrapper card-flag card-header card-main card-footer"
				data-href="${MMXPCINET.encodeEntities(this.getPropValue('href') ?? this.#product?.url)}"
				data-target="${MMXPCINET.encodeEntities(this.getPropValue('target'))}"
			>
				${this.#renderImage()}
				${this.#details?.map?.(detail => this.#renderProductDetail(detail)).join('')}
			</mmx-pcinet-card>
		`;
	}

	#renderProductDetail(detail) {
		const type = detail?.type?.value;

		if (type === 'price') {
			return this.#renderPrice(detail);
		}

		if (['button__view-product', 'button__add-to-cart', 'button__add-to-wishlist'].includes(type)) {
			return this.#renderButton(detail);
		}

		if (type === 'customfield') {
			return this.#renderCustomField(detail);
		}

		if (type === 'fragment') {
			return this.#renderFragmentDetail(detail);
		}

		if (type === 'discounts') {
			return this.#renderDiscounts(detail);
		}

		if (type === 'inv_available') {
			return this.#renderInventoryAvailable(detail);
		}

		if (type === 'weight') {
			return this.#renderWeight(detail);
		}

		return this.#renderCoreDetail(detail);
	}

	// Render: Core Detail
	#renderCoreDetail(detail = {}) {
		const type = detail?.type?.value;

		return this.#renderTextDetail({
			value: this.#product?.[type],
			detail
		});
	}

	// Render: Text Detail
	#renderTextDetail({value, detail} = {}) {
		const prefix = detail?.prefix?.value;
		const suffix = detail?.suffix?.value;

		if (MMXPCINET.valueIsEmpty(value)) {
			return this.#renderEmptyDetail();
		}

		return /*html*/`
			<mmx-pcinet-text
				slot="main"
				part="detail ${MMXPCINET.encodeEntities(detail?.type?.value)}"
				data-style="${MMXPCINET.encodeEntities(detail?.text_styles?.style?.value)}"
				style="${MMXPCINET.encodeEntities(this.getStylesFromGroup(detail?.text_styles))}"
			>
				${this.#renderProductDetailSpan('prefix', prefix)}
				${MMXPCINET.encodeEntities(value)}
				${this.#renderProductDetailSpan('suffix', suffix)}
			</mmx-pcinet-text>
		`;
	}

	#renderProductDetailSpan(type, value) {
		if (MMXPCINET.valueIsEmpty(value)) {
			return '';
		}

		return /*html*/`
			<span part="detail-${MMXPCINET.encodeEntities(type)}">
				${MMXPCINET.encodeEntities(value)}
			</span>
		`;
	}

	// Render: Empty Detail (keeps index-based preview_property_selectors working)
	#renderEmptyDetail() {
		return /*html*/`<div slot="main" part="detail empty" class="mmx-pcinet-product-card__detail--empty"></div>`;
	}

	// Render: Image
	#renderImage() {
		if (!this.getPropValue('show-image')) {
			return '';
		}

		const type = this.getPropValue('image-type');
		const fit = this.getPropValue('image-fit');
		const dimensions = this.getPropValue('image-dimensions');
		const [width, height] = dimensions?.split?.('x') ?? [1, 1];

		const image = this.#product?.imagetypes?.[type];
		const resizedImage = image?.sizes?.[dimensions] ?? image?.sizes?.original ?? {
			url: this.getPropValue('fallback-image'),
			height: '',
			width: ''
		};

		if (typeof resizedImage?.url !== 'string') {
			return '';
		}

		return /*html*/`
			<img
				slot="main"
				part="image"
				src="${MMXPCINET.encodeEntities(resizedImage.url)}"
				style="
					object-fit: ${MMXPCINET.encodeEntities(fit)};
					aspect-ratio: ${MMXPCINET.encodeEntities(width + ' / ' + height)};
				"
			>
		`;
	}

	// Render: Price
	#renderPrice(detail = {}) {
		// Price Display
		this.#product.price_display = this.#product.formatted_sale_price;
		if (detail.price?.displayed?.value === 'base'){
			this.#product.price_display = this.#product.formatted_base_price;
		}
		else if (detail.price?.displayed?.value === 'retail'){
			this.#product.price_display = this.#product.formatted_retail;
		}

		// Additional Price Display
		this.#product.additional_price_display = '';
		if (detail.price?.additional?.value === 'base'){
			this.#product.additional_price_display = this.#product.formatted_base_price;
		}
		else if (detail.price?.additional?.value === 'retail'){
			this.#product.additional_price_display = this.#product.formatted_retail;
		}

		const styles = this.getStylesFromGroup(detail?.text_styles);

		return /*html*/`
		<div
			slot="main"
			part="detail prices"
			class="mmx-pcinet-product-card__prices"
			style="${MMXPCINET.encodeEntities(styles)}"
		>
				<span
					part="price"
					class="mmx-pcinet-product-card__price type-${MMXPCINET.encodeEntities(detail?.text_styles?.style?.value || 'product-price')}"
					style="${MMXPCINET.encodeEntities(styles)}"
				>
					${this.#product.price_display}
				</span>
				${this.#product.additional_price_display.length && this.#product.additional_price_display !== this.#product.price_display ? /*html*/`
					<span
						part="additional-price"
						class="mmx-pcinet-product-card__additional-price type-${MMXPCINET.encodeEntities(detail?.text_styles?.style?.value || 'product-additional-price')}"
						style="${MMXPCINET.encodeEntities(styles)}"
					>
						${this.#product.additional_price_display}
					</span>
				` : ''}
			</div>
		`;
	}

	// Render: Button
	#renderButton(detail = {}) {
		const type = detail?.type?.value ?? 'button__view-product';

		let link;
		let text = detail.button?.text?.value;

		if (type === 'button__add-to-cart') {
			link = this.#addActionToUrl({
				url: detail?.ADPR_url?.url ?? this.getPropValue('adpr-url'),
				action: 'ADPR',
				product: this.#product
			});
			text = MMXPCINET.valueIsEmpty(text) ? 'Add to Cart' : text;
		} else if (type === 'button__add-to-wishlist') {
			link = this.#addActionToUrl({
				url: detail?.ATWL_url?.url ?? this.getPropValue('atwl-url'),
				action: 'ATWL',
				product: this.#product
			});
			text = MMXPCINET.valueIsEmpty(text) ? 'Add to Wishlist' : text;
		} else {
			link = this.#product.url;
			text = MMXPCINET.valueIsEmpty(text) ? 'View Details' : text;
		}

		return /*html*/`
			<mmx-pcinet-button
				slot="main"
				part="detail button button-${MMXPCINET.encodeEntities(type)}"
				exportparts="button: button-wrapper"
				href="${MMXPCINET.encodeEntities(link)}"
				data-style="${detail.button?.text?.textsettings?.fields?.normal?.button_style?.value || 'display-link'}"
				data-size="${detail.button?.text?.textsettings?.fields?.normal?.button_size?.value || 'm'}"
				data-styles="
					${MMXPCINET.encodeEntities(detail?.button?.text?.textsettings?.styles?.normal)}
					${MMXPCINET.encodeEntities(detail?.button?.text?.textsettings?.styles?.tablet)}
					${MMXPCINET.encodeEntities(detail?.button?.text?.textsettings?.styles?.mobile)}
					${MMXPCINET.encodeEntities(detail?.button?.text?.textsettings?.styles?.hover)}
					${MMXPCINET.encodeEntities(detail?.button?.text?.textsettings?.styles?.disabled)}
				"
				data-width="full"
			>
				${MMXPCINET.encodeEntities(text)}
			</mmx-pcinet-button>`;
	}

	#addActionToUrl({url, action = 'ADPR', quantity = 1}) {
		let actionUrl = new URL(url, document.baseURI);

		actionUrl.searchParams.append('Action', action);
		actionUrl.searchParams.append('Product_Code', this.#product.code);
		actionUrl.searchParams.append('Quantity', quantity);

		return actionUrl.toString();
	}

	// Render: Custom Field
	#renderCustomField(detail = {}) {
		const customFieldParts = detail?.customfield?.value?.split?.(':');

		if (customFieldParts?.length !== 2) {
			return this.#renderEmptyDetail();
		}

		const [moduleCode, fieldCode] = customFieldParts;
		const value = this.#product?.CustomField_Values?.[moduleCode]?.[fieldCode];
		return this.#renderTextDetail({
			value,
			detail
		});
	}

	// Render: Fragment
	#renderFragmentDetail(detail = {}) {
		const fragmentCode = detail?.fragment?.value;
		const fragmentContent = this.renderProductFragment({
			product: this.#product,
			fragmentCode
		});

		if (MMXPCINET.valueIsEmpty(fragmentContent)){
			return this.#renderEmptyDetail();
		}

		return /*html*/`
			<div
				slot="main"
				part="detail fragment fragment__${MMXPCINET.encodeEntities(fragmentCode)}"
				class="type-${MMXPCINET.encodeEntities(detail?.text_styles?.style?.value)}"
				style="${MMXPCINET.encodeEntities(this.getStylesFromGroup(detail?.text_styles))}"
			>
				${fragmentContent}
			</div>
		`;
	}

	// Render: Discounts
	#renderDiscounts(detail) {
		if (!Array.isArray(this.#product.discounts) || !this.#product.discounts.length) {
			return this.#renderEmptyDetail();
		}

		return /*html*/`
			<div
				slot="main"
				part="detail discounts"
			>
				${this.#product.discounts.map(discount => this.#renderDiscount({discount, detail})).join('')}
			</div>
		`;
	}

	#renderDiscount({discount = {}, detail = {}} = {}) {
		if (typeof discount?.descrip !== 'string') {
			return '';
		}

		return /*html*/`
			<div
				part="discount"
				class="type-${MMXPCINET.encodeEntities(detail?.text_styles?.style?.value)}"
				style="${MMXPCINET.encodeEntities(this.getStylesFromGroup(detail?.text_styles))}"
			>
				${discount.descrip}: ${discount.formatted_discount}
			</div>
		`;
	}

	// Render: Inventory Available
	#renderInventoryAvailable(detail = {}) {
		if (!this.#product?.inv_active) {
			return this.#renderEmptyDetail();
		}

		return this.#renderTextDetail({
			value: this.#product?.inv_available,
			detail
		});
	}

	// Render: Weight
	#renderWeight(detail = {}) {
		return this.#renderTextDetail({
			value: this.#product?.formatted_weight,
			detail
		});
	}
}

if (!customElements.get('mmx-pcinet-product-card')) {
	customElements.define('mmx-pcinet-product-card', MMXPCINET_ProductCard);
}