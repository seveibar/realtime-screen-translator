# Realtime Game Translation

This was created to translate Cyberpunk 2077 in realtime to english and pinyin
so I can try to learn chinese while playing.

## Usage

1. Clone [tessdata](https://github.com/tesseract-ocr/tessdata) to a directory

> You can also just download only the languages you need, in my case [chi_tra.traineddata](https://github.com/tesseract-ocr/tessdata/blob/main/chi_tra.traineddata)

2. Make sure `tesseract` is installed and `TESSDATA_PREFIX` is set properly

3. Run `yarn start`

## How it works

I create a transparent electron window to display text. We take screenshots of
the game window
