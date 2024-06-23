export async function awaitObjectProperties<T = any>(object: {
  [key: string]: Promise<T> | any;
}): Promise<{ data: { [key: string]: any }| null; error: any | null }> {
  try {
    const keys = Object.keys(object);
    const values = Object.values(object);

    const resolvedValues = await Promise.all(
      values.map((value) =>
        value instanceof Promise ? value : Promise.resolve(value),
      ),
    );

    const resolvedObject: { [key: string]: any } = {};

    keys.forEach((key, index) => {
      resolvedObject[key] = resolvedValues[index];
    });

    return { data: resolvedObject, error: null };
  } catch (error) {
    return { data: null, error: error };
  }
}
