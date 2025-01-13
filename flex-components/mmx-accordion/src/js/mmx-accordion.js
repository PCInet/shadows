class MMXPCINET_Accordion extends MMXPCINET_Element {
	static get props() {
		return {
		};
	}

	styleResourceCodes = ['mmx-pcinet-accordion'];
	renderUniquely = true;

	constructor() {
		super();
		this.makeShadow();
		this.bindRevealElement();
	}

	render() {
		return /*html*/`
			<div part="wrapper" class="mmx-pcinet-accordion">
				<slot part="title" name="title"></slot>
				<slot part="details" name="details"></slot>
			</div>
		`;
	}

	#details() {
		return this.querySelectorAll('details[slot="details"]');
	}

	afterRender(){
		this.#bindEvents();
	}

	#bindEvents() {
		this.addEventListener('toggle', (e) => {
			this.#onToggle(e);
		}, {capture: true});
	}

	#onToggle(e) {
		if (e.target.getAttribute('name')?.length) {
			this.#normalizeNamedToggleEvent(e);
		}
	}

	#normalizeNamedToggleEvent(e) {
		if (!e.target.open) {
			return;
		}

		this.#details().forEach(detail => {
			if (detail === e.target) {
				return;
			}

			detail.open = false;
		});
	}

	revealElement(element) {
		const details = MMXPCINET.closestElement('details', element);

		if (!details) {
			return;
		}

		details.open = true;
	}
}

if (!customElements.get('mmx-pcinet-accordion')) {
	customElements.define('mmx-pcinet-accordion', MMXPCINET_Accordion);
}