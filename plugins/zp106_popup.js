import React from "react"

function onInit(ref) {
    let { exc, id, container, props } = ref
    exc('load(["//z.zccdn.cn/vendor/floating-ui-core_1.0.1.js", "//z.zccdn.cn/vendor/floating-ui-dom_1.0.1.js"])', null, () => {
        const trigger = props.trigger ? (typeof props.trigger == "string" ? $(props.trigger) : props.trigger) : container.previousElementSibling
        const { computePosition, autoUpdate, flip, shift, offset } = FloatingUIDOM
        ref.cleanup = autoUpdate(trigger, container, () => {
            computePosition(trigger, container, {
                placement: "bottom",
                middleware: [offset(10), flip(), shift({ padding: 3 })],
            }).then(({ x, y, middlewareData }) => {
                Object.assign(container.style, { top: y + "px", left: x + "px" })
            })
        })

        ref.clickOut = e => { // 此处不能用container，要用$("#" + id)重新选择，因为再次mount的时候container已经陈旧。
            container = $("#" + id)
            if (container && !container.contains(e.target) && !trigger.contains(e.target)) exc(props.close, null, () => {
                // log("removeEventListener")
                document.body.removeEventListener("click", ref.clickOut)
                ref.cleanup()
                exc("render()")
            })
        }
        if (props.close) document.body.addEventListener("click", ref.clickOut)
    })
}

function render(ref) {
    return ref.children
}

function onDestroy(ref) {
    // log("onDestroy")
    document.body.removeEventListener("click", ref.clickOut)
    ref.cleanup()
}

const css = `.zp106 {
 position: absolute;
 z-index: 99;
 background-color: white;
 border: 1px solid #f4f4f4;
 border-radius: 2px;
 box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}
`

$plugin({
    id: "zp106",
    props: [{
        prop: "trigger",
        type: "text",
        label: "参照组件，可以填选择器",
        ph: "不填则为紧挨着的上一个组件"
    }, {
        prop: "close",
        type: "exp",
        label: "onClose表达式",
        ph: "不填则为紧挨着的上一个组件"
    }],
    onInit,
    render,
    onDestroy,
    css
})