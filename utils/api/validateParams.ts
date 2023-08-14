interface ValidationResult {
  missingParams: string[];
  presentParams: string[];
  requiredParams: string[];
}

export default function validateParams(
  body: any,
  requiredParams: string[]
): ValidationResult {
  let missingParams: string[] = [];
  let presentParams: string[] = [];

  for (let paramName of requiredParams) {
    if (body[paramName]) {
      presentParams.push(paramName);
    } else {
      missingParams.push(paramName);
    }
  }

  return { missingParams, presentParams, requiredParams };
}
