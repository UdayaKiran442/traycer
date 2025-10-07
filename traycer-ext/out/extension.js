"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const DocumentProcessor_1 = require("./DocumentProcessor");
let documentProcessor;
function activate(context) {
    console.log('Congratulations, your extension "traycer-ext" is now active!');
    documentProcessor = new DocumentProcessor_1.DocumentProcessor();
    // Hello World command
    const helloWorld = vscode.commands.registerCommand('traycer-ext.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from traycer-ext!');
    });
    // document process command
    const processDocument = vscode.commands.registerCommand('traycer-ext.processFolders', async () => {
        const result = await documentProcessor.processWorkspace();
        if (result && result.length > 0) {
            let index = 0;
            for (const file of result) {
                const payload = {
                    content: file.content,
                    uri: {
                        path: file.uri.path
                    }
                };
                // Send to backend
                const response = await fetch('http://localhost:3000/documents/embed', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                const jsonResponse = await response.json();
                index++;
                if (jsonResponse.success) {
                    vscode.window.showInformationMessage(`Backend Response: ${jsonResponse.message} for index ${index}`);
                }
                else {
                    vscode.window.showErrorMessage(`Backend Error: ${jsonResponse.error?.toString()} for index ${index}`);
                }
            }
        }
    });
    // Input Box command
    const showInputBox = vscode.commands.registerCommand('traycer-ext.showInput', async () => {
        const result = await vscode.window.showInputBox({
            placeHolder: 'Type your message here...',
            prompt: 'Enter some text',
            value: '',
            ignoreFocusOut: true,
            validateInput: text => {
                return text.trim().length > 0 ? null : 'Please enter a value';
            }
        });
        if (result !== undefined) {
            vscode.window.showInformationMessage(`You entered: ${result}`);
            // Here you can add what to do with the input
            // For example, process the input or open a webview with the result
        }
    });
    // workspace folder structure command
    const folderStructure = vscode.commands.registerCommand('traycer-ext.folderStructure', async () => {
        const files = await documentProcessor.processWorkspace();
        const tree = {};
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage("Workspace not present");
            return;
        }
        const workspaceFolder = workspaceFolders[0];
        if (files && files.length > 0) {
            for (const file of files) {
                const relativePath = path.relative(workspaceFolder.uri.fsPath, file.uri.fsPath);
                const parts = relativePath.split(path.sep);
                let current = tree;
                parts.forEach((part, index) => {
                    if (!current[part]) {
                        current[part] = index === parts.length - 1 ? null : {};
                    }
                    if (current[part] !== null) {
                        current = current[part];
                    }
                });
            }
            return tree;
        }
    });
    // Register both commands
    context.subscriptions.push(helloWorld, showInputBox, processDocument, folderStructure);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map