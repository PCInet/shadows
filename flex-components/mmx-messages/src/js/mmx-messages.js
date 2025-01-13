/**
 * MMX PCINET / MESSAGE
 */

class MMXPCINET_Message extends MMXPCINET_Element {

	static get props() {
		return {
			align: {
				options: ['left', 'center', 'right'],
				default: 'center'
			},
			display: {
				options: ['inline', 'inline-block', 'block'],
				default: 'block'
			},
			size: {
				options: ['s', 'm', 'l'],
				default: 'm'
			},
			style: {
				options: ['info', 'warning', 'error', 'success'],
				default: ''
			},
			variant: {
				options: ['flag', 'minimal', 'pill'],
				default: ''
			},
			dom: {
				options: ['light', 'shadow'],
				default: 'shadow'
			}
		};
	}

	styleResourceCodes = ['mmx-pcinet-base', 'mmx-pcinet-text', 'mmx-pcinet-messages'];
	renderUniquely = true;

	constructor() {
		super();
		this.makeShadow();
	}

	render() {
		return /*html*/`
			<div
				part="wrapper"
				class="
					mmx-pcinet-message
					mmx-pcinet-message--align-${this.getPropValue('align')}
					mmx-pcinet-message--display-${this.getPropValue('display')}
					mmx-pcinet-message--size-${this.getPropValue('size')}
					mmx-pcinet-message--style-${this.getPropValue('style')}
					mmx-pcinet-message--variant-${this.getPropValue('variant')}
				"
			>
				${this.renderContent()}
			</div>
		`;
	}

	renderContent() {
		if (this.getPropValue('dom') === 'shadow') {
			return this.innerHTML;
		}

		return '<slot></slot>';
	}
}

if (!customElements.get('mmx-pcinet-message')){
	customElements.define('mmx-pcinet-message', MMXPCINET_Message);
}