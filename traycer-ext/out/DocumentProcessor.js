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
exports.DocumentProcessor = void 0;
const vscode = __importStar(require("vscode"));
class DocumentProcessor {
    async processWorkspace() {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                vscode.window.showErrorMessage("Workspace not present");
                return;
            }
            const files = await this.getWorkspaceFiles(workspaceFolders);
            console.log("🚀 ~ DocumentProcessor ~ processWorkspace ~ files:", files);
            return files;
        }
        catch (error) {
            vscode.window.showErrorMessage("Error processing workspace");
            throw error;
        }
    }
    async getWorkspaceFiles(workspaceFolders) {
        const excludePattern = '{**/node_modules/**,**/dist/**,**/build/**,**/.git/**,**/.next/**,**/.vercel/**,**/.turbo/**,**/.expo/**,**/.expo-shared/**,**/*.lockb,**/*.min.*,**/.env.*,**/.*}';
        const fileData = [];
        for (const folder of workspaceFolders) {
            const folderFiles = await vscode.workspace.findFiles(new vscode.RelativePattern(folder, '**/*'), excludePattern);
            for (const fileUri of folderFiles) {
                const contentBytes = await vscode.workspace.fs.readFile(fileUri);
                const contentString = Buffer.from(contentBytes).toString('utf8');
                fileData.push({ uri: fileUri, content: contentString });
            }
        }
        return fileData;
    }
}
exports.DocumentProcessor = DocumentProcessor;
//# sourceMappingURL=DocumentProcessor.js.map