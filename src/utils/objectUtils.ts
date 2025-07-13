export type Mapping = { [key: string]: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JSONObject = { [key: string]: any };

/**
 * Recursively maps all fields of a JSON object (including nested fields)
 * to new field names based on a mapping object.
 *
 * @param obj - The input JSON object or array.
 * @param mapping - An object where keys are original field names and values are new field names.
 * @returns A new JSON object with fields renamed according to the mapping.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapFields(obj: any, mapping: Mapping): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => mapFields(item, mapping));
  } else if (obj !== null && typeof obj === 'object') {
    const result: JSONObject = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const mappedKey = mapping[key] || key;
        result[mappedKey] = mapFields(obj[key], mapping);
      }
    }
    return result;
  } else {
    return obj;
  }
}
