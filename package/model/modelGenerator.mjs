// runtypes.mjs
import { exec } from 'child_process';
import fs from 'fs';

import _ from 'lodash';
import pkg from 'lodash';
const { camelCase } = pkg;
import { Project } from 'ts-morph';

const modelGenerator = (jsonObject, parentName) => {
  const tempJsonFile = 'temp.json';
  fs.writeFileSync(tempJsonFile, jsonObject);
  const outputFile = `${parentName}.ts`;
  const command = `make_types -i ${outputFile} ${tempJsonFile} ${parentName}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error: ${stderr}`);
      return;
    }
    console.log(`Types generated successfully:\n${stdout}`);
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(outputFile);
    sourceFile.getInterfaces().forEach((interfaceNode) => {
      const originalInterfaceName = interfaceNode.getName();
      const newInterfaceName = `I${originalInterfaceName}`;
      interfaceNode.rename(newInterfaceName);
      interfaceNode.getProperties().forEach((property) => {
        const propertyName = property.getName();
        const camelCaseName = camelCase(propertyName);
        if (propertyName !== camelCaseName) {
          property.rename(camelCaseName);
        }
      });
    });
    project.saveSync();
    fs.unlinkSync(tempJsonFile);
  });
};

export default modelGenerator;
