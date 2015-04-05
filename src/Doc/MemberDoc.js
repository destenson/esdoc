import AbstractDoc from './AbstractDoc.js';
import MethodDoc from './MethodDoc.js';
//import ParamParser from '../Parser/ParamParser.js';
import Logger from '../Util/Logger.js';

export default class MemberDoc extends AbstractDoc {
  _apply() {
    super._apply();

    //this['@property']();
    //this['@type']();
    //this['@member']();

    delete this._value.export;
    delete this._value.importPath;
    delete this._value.importStyle;
  }

  ['@kind']() {
    super['@kind']();
    if (this._value.kind) return;
    this._value.kind = 'member';
  }

  ['@static']() {
    let tag = this._find(['@static']);
    if (tag) {
      let value = ['', 'true', true].includes(tag.tagValue);
      this._value.static = value;
      return;
    }

    let parent = this._node.parent;
    while (parent) {
      if (parent.type === 'MethodDefinition') {
        this._value.static = parent.static;
        break;
      }
      parent = parent.parent;
    }
  }

  ['@name']() {
    let name;
    let tags = this._findAll(['@name', '@member']);
    if (tags) {
      for (let tag of tags) {
        let {tagName, tagValue} = tag;
        if (tagName === '@name') {
          name = tagValue;
        } else if (tagName === '@member') {
          let {typeText, paramName, paramDesc} = ParamParser.parseParamValue(value, true, true, false);
          name = paramName;
        }
      }

    } else {
      let node = this._node;
      name = this._flattenMemberExpression(node.expression.left).replace(/^this\./, '');
    }

    this._value.name = name;
  }

  ['@memberof']() {
    MethodDoc.prototype['@memberof'].call(this);
  }
  //
  //['@property']() {
  //  MethodDoc.prototype['@property'].call(this);
  //}
  //
  //['@type']() {
  //  MethodDoc.prototype['@type'].call(this);
  //}

}
