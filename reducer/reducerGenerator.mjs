import fs from 'fs/promises';

import { Project, SyntaxKind } from 'ts-morph';

import { camelToUpperSnake, camelToPascal } from '../helper.mjs';

const reducerGenerator = async (name, path, rootReducerName) => {
  console.log(rootReducerName,'heloo')
  try {
    const pascalCase = camelToPascal(name);
    const screamingSnakeCase = camelToUpperSnake(name);

    const reducerContent = `
import { Reducer } from 'redux';
import { IErrorActionData } from '../../utils/error';
import { ${pascalCase}Actions, ${pascalCase}ActionTypes } from '../actions/${name}';

export interface I${pascalCase}State {
  ${name}: any;
  isSuccess: boolean;
  isLoading: boolean;
  error?: IErrorActionData;
}

const initial${pascalCase}State: I${pascalCase}State = {
  ${name}: {},
  isSuccess: false,
  isLoading: false,
  error: undefined,
};

const ${pascalCase}Reducer: Reducer<I${pascalCase}State, ${pascalCase}Actions> = (
  state = initial${pascalCase}State,
  action: ${pascalCase}Actions,
): I${pascalCase}State => {
  switch (action.type) {
    case ${pascalCase}ActionTypes.${screamingSnakeCase}:
      return {
        ...state,
        isSuccess: false,
        isLoading: true,
        error: undefined,
      };

    case ${pascalCase}ActionTypes.${screamingSnakeCase}_SUCCESS:
      return {
        ...state,
        // Update ${name} state here
        isSuccess: true,
        isLoading: false,
        error: undefined,
      };

    case ${pascalCase}ActionTypes.${screamingSnakeCase}_FAILURE:
      return {
        ...state,
        isSuccess: false,
        isLoading: false,
        error: {
          errorCode: action.payload?.errorCode,
          errorMessage: action.payload?.errorMessage,
          callBack: action.payload?.callBack,
        },
      };

    case ${pascalCase}ActionTypes.RESET_${screamingSnakeCase}:
      return initial${pascalCase}State;

    default:
      return state;
  }
};

export default ${pascalCase}Reducer;
    `;

    const filePath = `${path}/${name}.ts`;

    // Check if the root file exists
    const rootFilePath = `${path}/index.ts`;
    const project = new Project();
    const rootSourceFile = project.addSourceFileAtPathIfExists(rootFilePath);

    // If the root file exists, append the import statement
    if (rootSourceFile) {
      const sourceFile = project.addSourceFileAtPath(rootFilePath);
      const importStatement = `import ${pascalCase}Reducer from './${name}';`;
      if (!isImportStatementPresent(sourceFile, importStatement)) {
        const lastImport = sourceFile.getLastChildByKind(SyntaxKind.ImportDeclaration);
        const insertPos = lastImport ? lastImport.getEnd() : sourceFile.getFullStart();
        sourceFile.insertText(insertPos, `\n${importStatement}\n`);
        sourceFile.saveSync();
      }
      appendReducerToFile(rootFilePath, rootReducerName,pascalCase);
    } else {
      const sourceFile = project.createSourceFile(rootFilePath, '', { overwrite: true });
      sourceFile.insertText(
        0,
        `\nconst CartReducers = {\n  ${pascalCase}: ${pascalCase}Reducer,\n};\nexport default CartReducers;\n`,
      );
      sourceFile.insertText(0, `import ${pascalCase}Reducer from './${name}';\n`);
      sourceFile.saveSync();
    }

    // Write the reducer content to the file
    await fs.writeFile(filePath, reducerContent, 'utf8');
    console.log(`Generated TypeScript Redux reducer for ${name} in ${filePath}`);
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

function appendReducerToFile(filePath, rootReducerName, reducerName) {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);
  const rootReducerDeclaration = sourceFile.getVariableDeclaration(rootReducerName);

  if (rootReducerDeclaration) {
    const initializer = rootReducerDeclaration.getInitializer();
    if (initializer) {

      const reducerProperty = initializer.getProperty(reducerName);
      if (reducerProperty) {
        console.log(`${reducerName} already exists in ${rootReducerName} in ${filePath}`);
        return true;
      } else {
        initializer.addPropertyAssignment({ name: reducerName, initializer: `${reducerName}Reducer` });
        sourceFile.saveSync();
        console.log(`Added ${reducerName} to ${rootReducerName} in ${filePath}`);
        return true;
      }
    } else {
      console.log(`Initializer for ${rootReducerName} not found in ${filePath}`);
      return false;
    }
  } else {
    console.log(`${rootReducerName} variable declaration not found in ${filePath}`);
    return false;
  }
}

export default reducerGenerator;
