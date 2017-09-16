// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var babel = require("babel-core");
var babelEs2015Loose = require("babel-preset-es2015-loose");
var babelStage3 = require("babel-preset-stage-3");

const fullRange = doc => doc.validateRange(new vscode.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE));

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable1 = vscode.commands.registerCommand('extension.startBabelTransform-file', function () {
        // The code you place here will be executed every time your command is executed
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        var allText = editor.document.getText();
        var result = babel.transform(allText, {
            presets: [babelEs2015Loose,
                babelStage3
            ]
        }).code;

        (function(applyResult,range){
            editor.edit(function(textEditor){
                textEditor.replace(range, applyResult);
            });
        })(result,fullRange(editor.document));
        
    });

    context.subscriptions.push(disposable1);

    var disposable2 = vscode.commands.registerCommand('extension.startBabelTransform-selection', function () {
        // The code you place here will be executed every time your command is executed
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        var selection = editor.selection;
        var selectionText = editor.document.getText(selection);
        var result = babel.transform(selectionText, {
            presets: [babelEs2015Loose,
                babelStage3
            ]
        }).code;

        (function(applyResult,range){
            editor.edit(function(textEditor){
                textEditor.replace(range, applyResult);
            });
        })(result,selection);
    });

    context.subscriptions.push(disposable2);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;