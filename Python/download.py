import os
import requests

# Complete dictionary with all categories and URLs
urls_by_category = {
    "Zodiac Signs": [
        "https://zat.am/009-mmk/assets/img/meShaH.png",
        "https://zat.am/009-mmk/assets/img/vRRiShabhaH.png",
        "https://zat.am/009-mmk/assets/img/mithunam.png",
        "https://zat.am/009-mmk/assets/img/karkaTaH.png",
        "https://zat.am/009-mmk/assets/img/siMhaH.png",
        "https://zat.am/009-mmk/assets/img/kanyaa.png",
        "https://zat.am/009-mmk/assets/img/tulaa.png",
        "https://zat.am/009-mmk/assets/img/vRRishchikaH.png",
        "https://zat.am/009-mmk/assets/img/dhanuH.png",
        "https://zat.am/009-mmk/assets/img/makaraH.png",
        "https://zat.am/009-mmk/assets/img/kumbhaH.png",
        "https://zat.am/009-mmk/assets/img/miinaH.png",
    ],
    "People": [
        "https://i.ibb.co/pn3RjMV/devaH.png",
        "https://i.ibb.co/C2qyrCW/daanavaH.png",
        "https://i.ibb.co/dc5n3gm/kinnaraH.png",
        "https://i.ibb.co/mHkY6Nw/puruShaH.png",
        "https://i.ibb.co/HxK9LF2/mahilA.png",
        "https://i.ibb.co/wKkZ95H/shishuH.png",
        "https://i.ibb.co/PM285Th/bAlakaH.png",
        "https://i.ibb.co/J5ybGck/bAlikA.png",
        "https://i.ibb.co/ysrF33V/vruddhaH.png",
        "https://i.ibb.co/k3dPP4j/vruddhA.png",
        "https://i.ibb.co/NLxn5n5/rAjA.png",
        "https://i.ibb.co/93szgYh/rAj-nI.png",
    ],
    "Professions": [
        "https://i.ibb.co/y6n5hgt/soldier.png",
        "https://i.ibb.co/TBX8vzp/medicant.png",
        "https://i.ibb.co/kScqy45/gardner.png",
        "https://i.ibb.co/2gXz4rN/ny-Ayav-Ad-I.png",
        "https://i.ibb.co/gv9pMbg/ny-Ayav-Ad-Isha-H.png",
    ],
    "Artists and Entertainers": [
        "https://i.ibb.co/bX2FYXH/singerM.png",
        "https://i.ibb.co/gWkwL0t/singerF.png",
        "https://i.ibb.co/myDsc8Q/actor.png",
        "https://i.ibb.co/YPthx1h/actress.png",
        "https://i.ibb.co/fDGKWhT/dancerM.png",
        "https://i.ibb.co/BnZZmTh/dancerF.png",
        "https://i.ibb.co/9yzqRK9/sportsman.png",
        "https://i.ibb.co/SyHjqkc/goldsmith.png",
        "https://i.ibb.co/wcw6m9w/artist.png",
    ],
    "Body Parts": [
        "https://i.ibb.co/Y7kHjdF/face.png",
        "https://i.ibb.co/dj2syPM/head.png",
        "https://i.ibb.co/DK5ptzR/hair.png",
        "https://i.ibb.co/zrDpM3x/nose.png",
        "https://i.ibb.co/BwBV89Q/ear.png",
        "https://i.ibb.co/WKcqBzZ/eye.png",
    ],
    "Clothing": [
        "https://i.ibb.co/pywQ5Ms/karavastram.png",
        "https://i.ibb.co/jGPZ2bs/shaatikaa.png",
        "https://i.ibb.co/pxyZXhW/nicholaH.png",
        "https://i.ibb.co/nP8VDq2/ardhorukam.png",
    ],
    "Animals": [
        "https://i.ibb.co/3N4JFJh/sheep.png",
        "https://i.ibb.co/sHMYf46/mongoose.png",
        "https://i.ibb.co/Mk7W0QW/croc.png",
        "https://i.ibb.co/q09tpFD/squirrel.png",
        "https://i.ibb.co/5KD2MYF/dog.png",
        "https://i.ibb.co/BrD80X6/cat.png",
        "https://i.ibb.co/MRns0D8/rabbit.png",
        "https://i.ibb.co/W0FZj0m/donkey.png",
    ],
    "Wild Animals": [
        "https://i.ibb.co/w7ctnY3/wild-Buffalo.png",
        "https://i.ibb.co/CP3tzyP/deer.png",
        "https://i.ibb.co/CBvYPG2/bear.png",
        "https://i.ibb.co/bXLwfJv/wolf.png",
        "https://i.ibb.co/TPZ5ShZ/tiger.png",
        "https://i.ibb.co/DW9mL1Q/boar.png",
    ],
    "Birds": [
        "https://i.ibb.co/WfX5GdK/sparrow.png",
        "https://i.ibb.co/N3rGjxm/kapotaH.png",
        "https://i.ibb.co/0Mj4Jgk/kAkaH.png",
        "https://i.ibb.co/6PJNM1X/ulUkaH.png",
        "https://i.ibb.co/51B8QZF/garuDaH.png",
    ],
    "Fruits": [
        "https://i.ibb.co/pZGLxDW/drakshA.png",
        "https://i.ibb.co/k10TxmW/AmraM.png",
        "https://i.ibb.co/R4WdxJ0/daDimaH.png",
        "https://i.ibb.co/p2KsYm3/kadalI.png"
    ],
    "Actions": [
        "https://i.ibb.co/hFT9Nr0/Eats.png", 
        "https://i.ibb.co/Kr2QP1v/Drinks.png", 
        "https://i.ibb.co/23dHw11/Sees.png", 
        "https://i.ibb.co/GkvSgT8/reads-Action.png", 
        "https://i.ibb.co/x2nkTWB/writes2-Action.png"
    ],
    "Directions": [
        "https://i.ibb.co/C17rYWd/dUre.png", 
        "https://i.ibb.co/j8QnmNp/samiipe.png", 
        "https://i.ibb.co/5Mpw2j7/antaH.png", 
        "https://i.ibb.co/L0f25hc/bahir.png", 
        "https://i.ibb.co/SB6mkM9/savye.png", 
        "https://i.ibb.co/XpxcRQF/dakshiNe.png"
    ]
}

# Download each image and save it to the appropriate folder
for category, urls in urls_by_category.items():
    os.makedirs(category, exist_ok=True)
    for url in urls:
        filename = url.split("/")[-1]
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            with open(os.path.join(category, filename), 'wb') as file:
                file.write(response.content)
            print(f"Downloaded {filename} into {category}")
        except requests.exceptions.RequestException as e:
            print(f"Failed to download {filename} from {url}: {e}")
