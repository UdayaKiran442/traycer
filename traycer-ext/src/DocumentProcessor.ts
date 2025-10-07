import * as vscode from 'vscode';


export class DocumentProcessor {

    public async processWorkspace() {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                vscode.window.showErrorMessage("Workspace not present");
                return;
            }
            const files = await this.getWorkspaceFiles(workspaceFolders);
            console.log("🚀 ~ DocumentProcessor ~ processWorkspace ~ files:", files);
            return files;
        } catch (error) {
            vscode.window.showErrorMessage("Error processing workspace");
            throw error;
        }
    }

    public async getWorkspaceFiles(workspaceFolders: readonly vscode.WorkspaceFolder[]) {
        const excludePattern = '{**/node_modules/**,**/dist/**,**/build/**,**/.git/**,**/.next/**,**/.vercel/**,**/.turbo/**,**/.expo/**,**/.expo-shared/**,**/*.lockb,**/*.min.*,**/.env.*,**/.*}';
        const fileData: { uri: vscode.Uri, content: string }[] = [];

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