import * as vscode from 'vscode';
import * as path from 'path';

import { DocumentProcessor } from './DocumentProcessor';

let documentProcessor: DocumentProcessor;

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "traycer-ext" is now active!');

	documentProcessor = new DocumentProcessor();

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
				const jsonResponse = await response.json() as { success: boolean; message: string; error?: string };
				index++;
				if (jsonResponse.success) {
					vscode.window.showInformationMessage(`Backend Response: ${jsonResponse.message} for index ${index}`);
				} else {
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
	const folderStructure = vscode.commands.registerCommand('traycer-ext.folderStructure', async() => {
		const files = await documentProcessor.processWorkspace();
		const tree: Record<string, any> = {};
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
					if (current[part] !== null){
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

export function deactivate() { }
