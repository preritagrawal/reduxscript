import fs from 'fs/promises';
import { Project, SyntaxKind } from 'ts-morph';
import { camelToUpperSnake, camelToPascal } from '../helper.mjs';

const epicGenerator = async (name, path, rootEpicName) => {
  try {
    const pascalCase = camelToPascal(name);
    const screamingSnakeCase = camelToUpperSnake(name);

    const epicContent = `
import { Epic, ofType } from 'redux-observable';
import { ActionsObservable } from 'redux-observable';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { isOfType } from 'typesafe-actions';
import { IErrorActionData } from '../../utils/error';
import { ${pascalCase}Actions, ${pascalCase}ActionTypes } from '../actions/${name}';

const ${pascalCase}Epic: Epic<${pascalCase}Actions> = (action$: ActionsObservable<${pascalCase}Actions>) =>
  action$.pipe(
    filter(isOfType(${pascalCase}ActionTypes.${screamingSnakeCase})),
    mergeMap((action) => {
      return from(
        // Add your service call here
      ).pipe(
        map(() => ({
          type: ${pascalCase}ActionTypes.${screamingSnakeCase}_SUCCESS,
          // Add any payload data if required
        })),
        catchError((error: IErrorActionData) => {
          return of({
            type: ${pascalCase}ActionTypes.${screamingSnakeCase}_FAILURE,
            payload: {
              errorCode: error.errorCode,
              errorMessage: error.errorMessage,
              callBack: error.callBack,
            },
          });
        }),
      );
    })
  );

export default ${pascalCase}Epic;
    `;

    const filePath = `${path}/${name}.ts`;

    // Check if the root file exists
    const rootFilePath = `${path}/index.ts`;
    const project = new Project();
    const rootSourceFile = project.addSourceFileAtPathIfExists(rootFilePath);

    // If the root file exists, append the import statement
    if (rootSourceFile) {
      const sourceFile = project.addSourceFileAtPath(rootFilePath);
      const importStatement = `import ${pascalCase}Epic from './${name}';`;
      if (!isImportStatementPresent(sourceFile, importStatement)) {
        const lastImport = sourceFile.getLastChildByKind(SyntaxKind.ImportDeclaration);
        const insertPos = lastImport ? lastImport.getEnd() : sourceFile.getFullStart();
        sourceFile.insertText(insertPos, `\n${importStatement}\n`);
        sourceFile.saveSync();
      }
      appendEpicToFile(rootFilePath, rootEpicName, `${pascalCase}Epic`);
    } else {
      const sourceFile = project.createSourceFile(rootFilePath, '', { overwrite: true });
      sourceFile.insertText(
        0,
        `\nconst ${rootEpicName} = [${pascalCase}Epic];\nexport default ${rootEpicName};\n`,
      );
      sourceFile.insertText(0, `import ${pascalCase}Epic from './${name}';\n`);
      sourceFile.saveSync();
    }

    // Write the epic content to the file
    await fs.writeFile(filePath, epicContent, 'utf8');
    console.log(`Generated TypeScript Redux epic for ${name} in ${filePath}`);
  } catch (error) {
    console.error('Error writing the file:', error);
  }
};

function isImportStatementPresent(sourceFile, importStatement) {
  const importDeclarations = sourceFile.getImportDeclarations();
  return importDeclarations.some((importDeclaration) => {
    const existingImportStatement = importDeclaration.getText();
    return existingImportStatement === importStatement;
  });
}

function appendEpicToFile(filePath, rootEpicName, epicName) {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);
    const rootEpicDeclaration = sourceFile.getVariableDeclaration(rootEpicName);
  
    if (rootEpicDeclaration) {
      const initializer = rootEpicDeclaration.getInitializer();
      if (initializer && initializer.getKind() === SyntaxKind.ArrayLiteralExpression) {
        const initializerElements = initializer.getElements();
        const epicNameExists = initializerElements.some(element => element.getText() === epicName);
       
        if (epicNameExists) {
          console.log(`${epicName} already exists in ${rootEpicName} in ${filePath}`);
          return true;
        } else {
            const lastChild = initializer.getLastChild();
            if (lastChild) {
                const insertionPos = lastChild.getEnd();
                sourceFile.insertText(insertionPos-1, `, ${epicName}`);
                sourceFile.saveSync();
                console.log(`Added ${epicName} to ${rootEpicName} in ${filePath}`);
                return true;
            } else {
                console.log(`Failed to append ${epicName} to ${rootEpicName} in ${filePath}`);
                return false;
            }
        }
      }
    } else {
      console.log(`${rootEpicName} variable declaration not found in ${filePath}`);
      return false;
    }
  }

export default epicGenerator;
