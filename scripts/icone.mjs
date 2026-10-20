// Uso: node icone.mjs <exe> <versão> <icone.ico> <resedit/dist/index.js>
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const [exe, versao, ico, lib] = process.argv.slice(2);
const ResEdit = await import(pathToFileURL(lib).href);
const nt = ResEdit.NtExecutable.from(fs.readFileSync(exe), { ignoreCert: true });
const res = ResEdit.NtExecutableResource.from(nt);
const icone = ResEdit.Data.IconFile.from(fs.readFileSync(ico));
const grupos = ResEdit.Resource.IconGroupEntry.fromEntries(res.entries);
const id = grupos.length ? grupos[0].id : 1;
const lang = grupos.length ? grupos[0].lang : 1033;
ResEdit.Resource.IconGroupEntry.replaceIconsForResource(res.entries, id, lang, icone.icons.map((i) => i.data));
const info = ResEdit.Resource.VersionInfo.fromEntries(res.entries)[0];
if (info) {
  const [a, b, c] = versao.split(".").map(Number);
  info.setFileVersion(a || 0, b || 0, c || 0, 0, lang);
  info.setProductVersion(a || 0, b || 0, c || 0, 0, lang);
  info.setStringValues({ lang, codepage: 1200 }, {
    FileDescription: "Quadro ArtCraft", ProductName: "Quadro ArtCraft", InternalName: "Quadro ArtCraft",
    OriginalFilename: "Quadro ArtCraft.exe", CompanyName: "Vinícius Ruano", LegalCopyright: "MIT © Vinícius Ruano",
  });
  info.outputToResourceEntries(res.entries);
}
res.outputResource(nt);
fs.writeFileSync(exe, Buffer.from(nt.generate()));
console.log("ícone e propriedades do .exe trocados");
