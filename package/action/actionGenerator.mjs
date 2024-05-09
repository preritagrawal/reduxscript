import fs from 'fs/promises';

import { Project, SyntaxKind } from 'ts-morph';

import { camelToUpperSnake, camelToPascal } from '../helper.mjs';

const actionGenerator = async (name, path, rootActionName) => {
  const screamingSnakeCase = camelToUpperSnake(name);
  const pascalCase = camelToPascal(name);
  const actionTypes = {
    REQUEST: screamingSnakeCase,
    SUCCESS: `${screamingSnakeCase}_SUCCESS`,
    FAILURE: `${screamingSnakeCase}_FAILURE`,
    RESET: `RESET_${screamingSnakeCase}`,
  };

  const actionContent = `
import { ActionType, createAction } from 'typesafe-actions';
import { IErrorActionData } from '../../utils/error';

export enum ${pascalCase}ActionTypes {
  ${actionTypes.REQUEST} = '${actionTypes.REQUEST}',
  ${actionTypes.SUCCESS} = '${actionTypes.SUCCESS}',
  ${actionTypes.FAILURE} = '${actionTypes.FAILURE}',
  ${actionTypes.RESET} = '${actionTypes.RESET}',
}


export interface I${pascalCase}RequestData {
 // Add required types here
}

export const ${name} = createAction(
  ${pascalCase}ActionTypes.${actionTypes.REQUEST}
)<I${pascalCase}RequestData>();
export const ${name}Success = createAction(
  ${pascalCase}ActionTypes.${actionTypes.SUCCESS}
)();
export const ${name}Failure = createAction(
  ${pascalCase}ActionTypes.${actionTypes.FAILURE}
)<IErrorActionData>();
export const reset${name} = createAction(
  ${pascalCase}ActionTypes.${actionTypes.RESET}
)();

export type ${pascalCase}Action = ActionType<typeof ${name}>;
type ${pascalCase}SuccessAction = ActionType<typeof ${name}Success>;
type ${pascalCase}FailureAction = ActionType<typeof ${name}Failure>;
type Reset${pascalCase}Action = ActionType<typeof reset${name}>;

export type ${pascalCase}Actions =
  | ${pascalCase}Action
  | ${pascalCase}SuccessAction
  | ${pascalCase}FailureAction
  | Reset${pascalCase}Action;
  `;

  const project = new Project();
  const rootFilePath = `${path}/index.ts`;
  const sourceFile = project.addSourceFileAtPathIfExists(rootFilePath);
  const filePath = `${path}/${name}.ts`;
  const importPath = `./${name}.ts`;
  const importStatement = `import { ${pascalCase}Actions } from '${importPath.replace(/\.ts$/, '')}';`;

  if (sourceFile) {
    const sourceFile = project.addSourceFileAtPath(rootFilePath);

    if (!isImportStatementPresent(sourceFile, importStatement)) {
      const lastImport = sourceFile.getLastChildByKind(SyntaxKind.ImportDeclaration);
      const insertPos = lastImport ? lastImport.getEnd() : sourceFile.getFullStart();
      sourceFile.insertText(insertPos, `\n${importStatement}\n`);
      sourceFile.saveSync();
    }
    appendTypeToFile(rootFilePath, rootActionName, `${pascalCase}Actions`);
  } else {
    const sourceFile = project.createSourceFile(rootFilePath, '', { overwrite: true });
    sourceFile.insertText(0, `export type ${rootActionName} = ${pascalCase}Actions ;\n`);
    sourceFile.insertText(0, importStatement + '\n');
    sourceFile.saveSync();
  }

  try {
    await fs.writeFile(filePath, actionContent, 'utf8');
    console.log(`Generated TypeScript Redux action for ${name} in ${filePath}`);
  } catch (error) {
    console.error('Error writing the file:', error);
  }
};

function appendTypeToFile(filePath, typeName, newType) {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  const typeDeclaration = sourceFile.getTypeAlias(typeName);
  if (typeDeclaration) {
    const existingTypeText = typeDeclaration.getText();
    if (!existingTypeText.includes(newType)) {
      const updatedType = existingTypeText.replace(/;(\s*)$/, ` | ${newType};`);
      typeDeclaration.replaceWithText(updatedType);
      sourceFile.saveSync();
      console.log(`Added ${newType} to ${typeName} in ${filePath}`);
    } else {
      console.log(`${newType} already present in ${typeName} in ${filePath}`);
    }
  } else {
    console.log(`${typeName} not found in ${filePath}`);
  }
}

function isImportStatementPresent(sourceFile, importStatement) {
  const importDeclarations = sourceFile.getImportDeclarations();
  return importDeclarations.some((importDeclaration) => {
    const existingImportStatement = importDeclaration.getText();
    return existingImportStatement === importStatement;
  });
}

export default actionGenerator;
