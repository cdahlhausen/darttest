declare module "upath" {

  /**
   * A parsed path object generated by path.parse() or consumed by path.format().
   */
  export interface ParsedPath {
    /**
     * The root of the path such as '/' or 'c:\'
     */
    root: string;
    /**
     * The full directory path such as '/home/user/dir' or 'c:\path\dir'
     */
    dir: string;
    /**
     * The file name including extension (if any) such as 'index.html'
     */
    base: string;
    /**
     * The file extension (if any) such as '.html'
     */
    ext: string;
    /**
     * The file name without extension (if any) such as 'index'
     */
    name: string;
  }

  /**
   * Version of the library
   */
  export var VERSION: string;

  /**
   * Just converts all `to/` and consolidates duplicates, without performing any normalization.
   *
   * @param p string path to convert to unix.
   */
  export function toUnix(p: string): string;

  /**
   * Exactly like path.normalize(path), but it keeps the first meaningful ./.
   *
   * Note that the unix / is returned everywhere, so windows \ is always converted to unix /.
   *
   * @param p string path to normalize.
   */
  export function normalizeSafe(p: string): string;

  /**
   * Exactly like path.normalizeSafe(path), but it trims any useless ending /.
   *
   * @param p string path to normalize
   */
  export function normalizeTrim(p: string): string;

  /**
   * Exactly like path.join(), but it keeps the first meaningful ./.
   *
   * Note that the unix / is returned everywhere, so windows \ is always converted to unix /.
   *
   * @param paths string paths to join
   */
  export function joinSafe(...p: any[]): string;

  /**
   * Adds .ext to filename, but only if it doesn't already have the exact extension.
   *
   * @param file string filename to add extension to
   * @param ext string extension to add
   */
  export function addExt(file: string, ext: string): string;

  /**
   * Trims a filename's extension.
   *
   * Extensions are considered to be up to maxSize chars long, counting the dot (defaults to 7).
   *
   * An Array of ignoreExts (eg ['.min']) prevents these from being considered as extension, thus are not trimmed.
   *
   * @param filename string filename to trim it's extension
   * @param ignoreExts array extensions to ignore
   * @param maxSize number max length of the extension
   */
  export function trimExt(filename: string, ignoreExts?: string[], maxSize?: number): string;

  /**
   * Removes the specific ext extension from filename, if it has it. Otherwise it leaves it as is. As in all upath functions, it be .ext or ext.
   *
   * @param file string filename to remove extension to
   * @param ext string extension to remove
   */
  export function removeExt(filename: string, ext: string): string;

  /**
   * Changes a filename's extension to ext. If it has no (valid) extension, it adds it.
   *
   * Valid extensions are considered to be up to maxSize chars long, counting the dot (defaults to 7).
   *
   * An Array of ignoreExts (eg ['.min']) prevents these from being considered as extension, thus are not changed - the new extension is added instead.
   *
   * @param filename string filename to change it's extension
   * @param ext string extension to change to
   * @param ignoreExts array extensions to ignore
   * @param maxSize number max length of the extension
   */
  export function changeExt(filename: string, ext: string, ignoreExts?: string[], maxSize?: number): string;

  /**
   * Adds .ext to filename, only if it doesn't already have any old extension.
   *
   * (Old) extensions are considered to be up to maxSize chars long, counting the dot (defaults to 7).
   *
   * An Array of ignoreExts (eg ['.min']) will force adding default .ext even if one of these is present.
   *
   * @param filename string filename to default to it's extension
   * @param ext string extension to default to
   * @param ignoreExts array extensions to ignore
   * @param maxSize number max length of the extension
   */
  export function defaultExt(filename: string, ext: string, ignoreExts?: string[], maxSize?: number): string;

  /**
   * Normalize a string path, reducing '..' and '.' parts.
   * When multiple slashes are found, they're replaced by a single one; when the path contains a trailing slash, it is preserved. On Windows backslashes are used.
   *
   * @param p string path to normalize.
   */
  export function normalize(p: string): string;
  /**
   * Join all arguments together and normalize the resulting path.
   * Arguments must be strings. In v0.8, non-string arguments were silently ignored. In v0.10 and up, an exception is thrown.
   *
   * @param paths string paths to join.
   */
  export function join(...paths: any[]): string;
  /**
   * Join all arguments together and normalize the resulting path.
   * Arguments must be strings. In v0.8, non-string arguments were silently ignored. In v0.10 and up, an exception is thrown.
   *
   * @param paths string paths to join.
   */
  export function join(...paths: string[]): string;
  /**
   * The right-most parameter is considered {to}.  Other parameters are considered an array of {from}.
   *
   * Starting from leftmost {from} paramter, resolves {to} to an absolute path.
   *
   * If {to} isn't already absolute, {from} arguments are prepended in right to left order, until an absolute path is found. If after using all {from} paths still no absolute path is found, the current working directory is used as well. The resulting path is normalized, and trailing slashes are removed unless the path gets resolved to the root directory.
   *
   * @param pathSegments string paths to join.  Non-string arguments are ignored.
   */
  export function resolve(...pathSegments: any[]): string;
  /**
   * Determines whether {path} is an absolute path. An absolute path will always resolve to the same location, regardless of the working directory.
   *
   * @param path path to test.
   */
  export function isAbsolute(path: string): boolean;
  /**
   * Solve the relative path from {from} to {to}.
   * At times we have two absolute paths, and we need to derive the relative path from one to the other. This is actually the reverse transform of path.resolve.
   *
   * @param from
   * @param to
   */
  export function relative(from: string, to: string): string;
  /**
   * Return the directory name of a path. Similar to the Unix dirname command.
   *
   * @param p the path to evaluate.
   */
  export function dirname(p: string): string;
  /**
   * Return the last portion of a path. Similar to the Unix basename command.
   * Often used to extract the file name from a fully qualified path.
   *
   * @param p the path to evaluate.
   * @param ext optionally, an extension to remove from the result.
   */
  export function basename(p: string, ext?: string): string;
  /**
   * Return the extension of the path, from the last '.' to end of string in the last portion of the path.
   * If there is no '.' in the last portion of the path or the first character of it is '.', then it returns an empty string
   *
   * @param p the path to evaluate.
   */
  export function extname(p: string): string;
  /**
   * The platform-specific file separator. '\\' or '/'.
   */
  export var sep: string;
  /**
   * The platform-specific file delimiter. ';' or ':'.
   */
  export var delimiter: string;
  /**
   * Returns an object from a path string - the opposite of format().
   *
   * @param pathString path to evaluate.
   */
  export function parse(pathString: string): ParsedPath;
  /**
   * Returns a path string from an object - the opposite of parse().
   *
   * @param pathString path to evaluate.
   */
  export function format(pathObject: ParsedPath): string;

  export module posix {
    export function normalize(p: string): string;
    export function join(...paths: any[]): string;
    export function resolve(...pathSegments: any[]): string;
    export function isAbsolute(p: string): boolean;
    export function relative(from: string, to: string): string;
    export function dirname(p: string): string;
    export function basename(p: string, ext?: string): string;
    export function extname(p: string): string;
    export var sep: string;
    export var delimiter: string;
    export function parse(p: string): ParsedPath;
    export function format(pP: ParsedPath): string;
  }

  export module win32 {
    export function normalize(p: string): string;
    export function join(...paths: any[]): string;
    export function resolve(...pathSegments: any[]): string;
    export function isAbsolute(p: string): boolean;
    export function relative(from: string, to: string): string;
    export function dirname(p: string): string;
    export function basename(p: string, ext?: string): string;
    export function extname(p: string): string;
    export var sep: string;
    export var delimiter: string;
    export function parse(p: string): ParsedPath;
    export function format(pP: ParsedPath): string;
  }
}
