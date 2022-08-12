import { Injectable } from '@angular/core';

@Injectable()
export class HTMLSanitizerService {

    escape: boolean;
    allowedTags: any;
    allowedCss: any;
    doc: Document;

    constructor() {
        this.init();
    }

    init(escape?: boolean, tags?: any, css?: any, urls?: any, classes?: any) {
        this.doc = document.implementation.createHTMLDocument();
        if (urls == null) {
            //urls = ['http://', 'https://'];
            urls = ['data:image/'];
        }
        if (classes == null) {
            classes = ['rpc-grid',
                'rpc-col-xs-1', 'rpc-col-xs-2', 'rpc-col-xs-3', 'rpc-col-xs-4', 'rpc-col-xs-5', 'rpc-col-xs-6', 'rpc-col-xs-7', 'rpc-col-xs-8', 'rpc-col-xs-9', 'rpc-col-xs-10', 'rpc-col-xs-11', 'rpc-col-xs-12',
                'rpc-col-s-1', 'rpc-col-s-2', 'rpc-col-s-3', 'rpc-col-s-4', 'rpc-col-s-5', 'rpc-col-s-6', 'rpc-col-s-7', 'rpc-col-s-8', 'rpc-col-s-9', 'rpc-col-s-10', 'rpc-col-s-11', 'rpc-col-s-12',
                'rpc-col-m-1', 'rpc-col-m-2', 'rpc-col-m-3', 'rpc-col-m-4', 'rpc-col-m-5', 'rpc-col-m-6', 'rpc-col-m-7', 'rpc-col-m-8', 'rpc-col-m-9', 'rpc-col-m-10', 'rpc-col-m-11', 'rpc-col-m-12',
                'rpc-col-lg-1', 'rpc-col-lg-2', 'rpc-col-lg-3', 'rpc-col-lg-4', 'rpc-col-lg-5', 'rpc-col-lg-6', 'rpc-col-lg-7', 'rpc-col-lg-8', 'rpc-col-lg-9', 'rpc-col-lg-10', 'rpc-col-lg-11', 'rpc-col-lg-12',
                'rpc-col-xl-1', 'rpc-col-xl-2', 'rpc-col-xl-3', 'rpc-col-xl-4', 'rpc-col-xl-5', 'rpc-col-xl-6', 'rpc-col-xl-7', 'rpc-col-xl-8', 'rpc-col-xl-9', 'rpc-col-xl-10', 'rpc-col-xl-11', 'rpc-col-xl-12'
            ];
        }

        if (this.allowedTags == null) {
            // Configure small set of default tags
            let unconstrainted = (x) => { return x; };
            let class_sanitizer = this.makeClassSanitizer(classes);
            let globalAttributes = {
                'dir': unconstrainted,
                'lang': unconstrainted,
                'title': unconstrainted,
                'style': unconstrainted,
            };
            let url_sanitizer = this.makeUrlSanitizer(urls);
            this.allowedTags = {
                // 'a': this.mergeMap(globalAttributes, {
                //   'download': unconstrainted,
                //   'href': url_sanitizer,
                //   'hreflang': unconstrainted,
                //   'ping': url_sanitizer,
                //   'rel': unconstrainted,
                //   'target': unconstrainted,
                //   'type': unconstrainted
                // }),
                'img': this.mergeMap(globalAttributes, {
                    'alt': unconstrainted,
                    'height': unconstrainted,
                    'src': url_sanitizer,
                    'width': unconstrainted
                }),
                'div': this.mergeMap(globalAttributes, {
                    'id': unconstrainted,
                    'class': class_sanitizer,
                }),
                'p': globalAttributes,
                'span': globalAttributes,
                'br': globalAttributes,
                'b': globalAttributes,
                'i': globalAttributes,
                'u': globalAttributes
            };
        }

        if (this.allowedCss == null) {
            // Small set of default css properties
            this.allowedCss = ['border', 'margin', 'padding'];
        }

    }
    makeClassSanitizer(allowed_class) {
        return (str: string) => {
            if (!str) { return ''; }
            let classes = str.split(' ');
            classes.forEach(clase => {
                for (var i in allowed_class) {
                    if (str != allowed_class[i]) {
                        return '';
                    }
                }
            });

            return str;
        };
    }

    makeUrlSanitizer(allowed_urls) {
        return (str) => {
            if (!str) { return ''; }
            for (var i in allowed_urls) {
                if (str.startsWith(allowed_urls[i])) {
                    return str;
                }
            }
            return '';
        };
    }

    mergeMap(atributes, newAtributes) {
        var r = atributes;
        for (var key in newAtributes) {
            r[key] = newAtributes[key];
        }
        return r;
    }

    sanitizeString(input) {
        var div = this.doc.createElement('div');
        div.innerHTML = input;

        // Return the sanitized version of the node.
        return this.sanitizeNode(div).innerHTML;
    }

    sanitizeNode(node) {
        // Note: <form> can have it's nodeName overriden by a child node. It's
        // not a big deal here, so we can punt on this.
        var node_name = node.nodeName.toLowerCase();
        if (node_name == '#text') {
            // text nodes are always safe
            return node;
        }
        if (node_name == '#comment') {
            // always strip comments
            return this.doc.createTextNode('');
        }
        if (!this.allowedTags.hasOwnProperty(node_name)) {
            // this node isn't allowed
            console.log("forbidden node: " + node_name);
            if (this.escape) {
                return this.doc.createTextNode(node.outerHTML);
            }
            return this.doc.createTextNode('');
        }

        // create a new node
        var copy = this.doc.createElement(node_name);

        // copy the whitelist of attributes using the per-attribute sanitizer
        for (var n_attr = 0; n_attr < node.attributes.length; n_attr++) {
            var attr = node.attributes.item(n_attr).name;
            if (this.allowedTags[node_name].hasOwnProperty(attr)) {
                var sanitizer = this.allowedTags[node_name][attr];
                copy.setAttribute(attr, sanitizer(node.getAttribute(attr)));
            }
        }
        // copy the whitelist of css properties
        for (var css in this.allowedCss) {
            copy.style[this.allowedCss[css]] = node.style[this.allowedCss[css]];
        }

        // recursively sanitize child nodes
        while (node.childNodes.length > 0) {
            var child = node.removeChild(node.childNodes[0]);
            copy.appendChild(this.sanitizeNode(child));
        }
        return copy;
    }

    runSanitizer(strHtml: string) {
        let sanitizedHtml = this.sanitizeString(strHtml);
        return sanitizedHtml;
    }
}
