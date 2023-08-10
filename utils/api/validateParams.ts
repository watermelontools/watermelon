interface ValidationResult {
  missingParams: string[];
  requiredParams: string[];
}

export default function validateParams(
  body: any,
  requiredParams: string[]
): ValidationResult {
  let missingParams: string[] = [];

  for (let paramName of requiredParams) {
    if (!body[paramName]) {
      missingParams.push(paramName);
    }
  }

  return { missingParams, requiredParams };
}
