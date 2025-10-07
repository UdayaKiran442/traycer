import * as vscode from 'vscode';
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
		console.log(result);
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

	// Register both commands
	context.subscriptions.push(helloWorld, showInputBox, processDocument);
}

export function deactivate() { }
