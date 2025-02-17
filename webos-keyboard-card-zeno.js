class WebOSKeyboardCardZeno extends HTMLElement {
    setConfig(config) {

        this.config = config;
        if (!config.target || typeof this.config.target !== "string") {
            throw new Error('You need to define a target');
        }
        this.render();
    }

    render() {
        if (!this.content) {
            this.card = document.createElement('ha-card');
            this.content = document.createElement('div');
            this.content.style.padding = '0 16px 16px';
            this.card.appendChild(this.content);
            this.appendChild(this.card);
        }
        let label = this.config.label || "Text to type"
        this.content.innerHTML = `
      <div style="display: flex">
        <ha-textfield style="flex-grow: 1" label="${label}"></ha-textfield>
      </div>
    `;
        this.content.querySelector("ha-textfield").addEventListener("value-changed", this.sendText.bind(this), false);
        this.content.querySelector("ha-textfield").addEventListener("keyup", this.keyup.bind(this), false);
    }

    keyup(e) {
        if (e.key === "Enter") {
            this.sendEnter()
        }
    }

    sendText() {
        let txt = this.content.querySelector("ha-textfield").value;
        this.hass.callService("webostv", "command", {
            entity_id: this.config.target,
            command: "com.webos.service.ime/insertText",
            payload: {
                text: txt,
                replace: true,
            },
        });
    }

    sendEnter() {
        this.hass.callService("webostv", "command", {
            entity_id: this.config.target,
            command: "com.webos.service.ime/sendEnterKey",
        });
    }
}

customElements.define('webos-keyboard-card-zeno', WebOSKeyboardCardZeno);
