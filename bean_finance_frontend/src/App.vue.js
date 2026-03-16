"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var transaction_1 = require("./api/transaction");
var list = (0, vue_1.ref)([]);
var editingItem = (0, vue_1.ref)(null);
var showEditDialog = (0, vue_1.ref)(false);
// 表单默认值
var form = (0, vue_1.ref)({
    amount: 0,
    type: 'expense',
    category: '',
    note: '',
    recordedAt: new Date().toISOString().split('T')[0]
});
// 加载数据
var loadData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, transaction_1.getTransactions)()];
            case 1:
                res = _a.sent();
                list.value = res.data;
                return [2 /*return*/];
        }
    });
}); };
// 提交数据
var handleSave = function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!form.value.category || form.value.amount <= 0) {
                    alert("请输入分类和金额！");
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, transaction_1.addTransaction)(form.value)];
            case 2:
                _a.sent();
                alert('记账成功！');
                // 清空表单
                form.value.category = '';
                form.value.note = '';
                // 重新加载列表，让页面即时更新
                return [4 /*yield*/, loadData()];
            case 3:
                // 重新加载列表，让页面即时更新
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.error("提交失败:", err_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var handleDelete = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!id)
                    return [2 /*return*/];
                if (!confirm('确定要删除这条记账记录吗？'))
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, transaction_1.deleteTransaction)(id)];
            case 2:
                _a.sent();
                alert('删除成功');
                return [4 /*yield*/, loadData()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                console.error("删除失败:", err_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var handleEdit = function (item) {
    editingItem.value = __assign(__assign({}, item), { recordedAt: new Date(item.recordedAt).toISOString().split('T')[0] });
    showEditDialog.value = true;
};
var handleUpdate = function () { return __awaiter(void 0, void 0, void 0, function () {
    var err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!editingItem.value || !editingItem.value.id)
                    return [2 /*return*/];
                if (!editingItem.value.category || editingItem.value.amount <= 0) {
                    alert("请输入分类和金额！");
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, transaction_1.updateTransaction)(editingItem.value.id, editingItem.value)];
            case 2:
                _a.sent();
                alert('更新成功！');
                showEditDialog.value = false;
                return [4 /*yield*/, loadData()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                console.error("更新失败:", err_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var handleCancel = function () {
    showEditDialog.value = false;
    editingItem.value = null;
};
var totalBalance = (0, vue_1.computed)(function () {
    return list.value.reduce(function (sum, item) {
        // 支出为负，收入为正
        var amount = Number(item.amount);
        return item.type === 'expense' ? sum - amount : sum + amount;
    }, 0);
});
(0, vue_1.onMounted)(loadData);
var __VLS_ctx = __assign(__assign({}, {}), {});
var __VLS_components;
var __VLS_intrinsics;
var __VLS_directives;
/** @type {__VLS_StyleScopedClasses['dialog-buttons']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "app-wrapper" }));
/** @type {__VLS_StyleScopedClasses['app-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "container" }));
/** @type {__VLS_StyleScopedClasses['container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "balance-card" }));
/** @type {__VLS_StyleScopedClasses['balance-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)(__assign({ style: ({ color: __VLS_ctx.totalBalance >= 0 ? '#27ae60' : '#c0392b' }) }));
((__VLS_ctx.totalBalance / 100).toFixed(2));
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "section-box" }));
/** @type {__VLS_StyleScopedClasses['section-box']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "input-group" }));
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    type: "number",
    placeholder: "金额(分)",
});
(__VLS_ctx.form.amount);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "input-group" }));
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    value: (__VLS_ctx.form.type),
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "expense",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "income",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "input-group" }));
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    placeholder: "分类 (如: 餐饮)",
});
(__VLS_ctx.form.category);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "input-group" }));
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    placeholder: "备注",
});
(__VLS_ctx.form.note);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "input-group" }));
/** @type {__VLS_StyleScopedClasses['input-group']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    type: "date",
});
(__VLS_ctx.form.recordedAt);
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.handleSave) }));
__VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ class: "section-box" }));
/** @type {__VLS_StyleScopedClasses['section-box']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.loadData) }, { style: {} }));
__VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({});
var _loop_1 = function (item) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
        key: (item.id),
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "record-info" }));
    /** @type {__VLS_StyleScopedClasses['record-info']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (item.category);
    __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.small, __VLS_intrinsics.small)({});
    (new Date(item.recordedAt).toISOString().split('T')[0]);
    (item.note);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)(__assign({ style: ({ color: item.type === 'expense' ? '#c0392b' : '#27ae60', fontWeight: 'bold' }) }));
    (item.type === 'expense' ? '-' : '+');
    ((Number(item.amount) / 100).toFixed(2));
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.handleEdit(item);
            // @ts-ignore
            [totalBalance, totalBalance, form, form, form, form, form, handleSave, loadData, list, handleEdit,];
        } }, { class: "btn-edit" }), { style: {} }));
    /** @type {__VLS_StyleScopedClasses['btn-edit']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign(__assign({ onClick: function () {
            var _a = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _a[_i] = arguments[_i];
            }
            var $event = _a[0];
            __VLS_ctx.handleDelete(item.id);
            // @ts-ignore
            [handleDelete,];
        } }, { class: "btn-delete" }), { style: {} }));
    /** @type {__VLS_StyleScopedClasses['btn-delete']} */ ;
    // @ts-ignore
    [];
};
for (var _i = 0, _a = __VLS_vFor((__VLS_ctx.list)); _i < _a.length; _i++) {
    var item = _a[_i][0];
    _loop_1(item);
}
if (__VLS_ctx.showEditDialog && __VLS_ctx.editingItem) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.section, __VLS_intrinsics.section)(__assign({ onClick: (__VLS_ctx.handleCancel) }, { class: "dialog-overlay" }));
    /** @type {__VLS_StyleScopedClasses['dialog-overlay']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "dialog" }));
    /** @type {__VLS_StyleScopedClasses['dialog']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "input-group" }));
    /** @type {__VLS_StyleScopedClasses['input-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        type: "number",
        placeholder: "金额(分)",
    });
    (__VLS_ctx.editingItem.amount);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "input-group" }));
    /** @type {__VLS_StyleScopedClasses['input-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
        value: (__VLS_ctx.editingItem.type),
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        value: "expense",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        value: "income",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "input-group" }));
    /** @type {__VLS_StyleScopedClasses['input-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        placeholder: "分类",
    });
    (__VLS_ctx.editingItem.category);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "input-group" }));
    /** @type {__VLS_StyleScopedClasses['input-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        placeholder: "备注",
    });
    (__VLS_ctx.editingItem.note);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "input-group" }));
    /** @type {__VLS_StyleScopedClasses['input-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        type: "date",
    });
    (__VLS_ctx.editingItem.recordedAt);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)(__assign({ class: "dialog-buttons" }));
    /** @type {__VLS_StyleScopedClasses['dialog-buttons']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.handleUpdate) }));
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)(__assign({ onClick: (__VLS_ctx.handleCancel) }, { style: {} }));
}
// @ts-ignore
[showEditDialog, editingItem, editingItem, editingItem, editingItem, editingItem, editingItem, handleCancel, handleCancel, handleUpdate,];
var __VLS_export = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({});
exports.default = {};
