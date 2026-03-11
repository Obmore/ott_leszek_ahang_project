# Word dokumentum készítése a tutoriálból

## Word (.docx) készítése

1. Nyisd meg az **OttLeszek_tutorial.html** fájlt Microsoft Word-ben (Fájl → Megnyitás, vagy dupla kattintás, ha a .html a Worddel van társítva).
2. A dokumentum megjelenik az alkalmazás ikonnal, a tutoriál szövegével és a beágyazott képernyőképekkel (ha a `images/` mappában vannak a screenshotok).
3. **Mentés Word formátumban:** Fájl → Mentés másként → válaszd a **Word dokumentum (*.docx)** formátumot, add meg a fájlnevet (pl. `OttLeszek_bemutato.docx`), majd mentsd.

## Képek

- Az **images/icon.png** az app ikonja; a Word a mappa mellett lévő `images` mappából tölti be, ha a .html-t a `word-tutorial` mappából nyitod meg.
- A képernyőképek a `images/` mappából töltődnek be (screenshot-*.png).

## Mappa struktúra (ne töröld)

```
word-tutorial/
  OttLeszek_tutorial.html   ← ezt nyisd meg Wordben
  images/
    icon.png                ← app ikon (Word ehhez a mappához képest keres)
  README.md                 ← ez a leírás
```
