# 用 C 從零打造神經網路：大多數 AI 工程師跳過的事

用 C 從零打造神經網路，不是把產品出貨最有效率的做法。但對 William Norden 來說，這是他唯一能確定自己「真的搞懂模型在做什麼」的方法。

Norden 是聖塔克拉拉大學的研究工程師——他的工作橫跨神經型態運算（Spiking Neural Networks、mem-devices）、認知神經科學（Chen Lab），以及硬體層的邊緣 AI（Renesas Electronics，他在那裡用 C 為嵌入式微控制器打造了一套深度強化學習程式庫）。他透過 DeepRune 推進 Google 的 AlphaChip，用於 VLSI 平面佈線；並透過 MultiSim 為機器人模擬基於物理的環境。他最廣為人知的個人作品是 MNIST.c：一個完全用 C 手寫、不依賴任何函式庫、準確率超過 98% 的神經網路。

在這一集 Still Human 裡，Norden 與主持人 Perkin 探索一個落在 2026 年 AI 時刻正中央的問題：當代理人（agents）已經能寫程式、跑實驗、把工作流程平行化時——「走得更深」這件事的價值是什麼？Norden 的回答取材自神經科學、哲學、俄式鋼琴教學法，以及競技網球。它不是一場典型的工程師對談。而那正是重點。

---

## 本集涵蓋的核心主題

- 為什麼神經網路框架會養出一批「不理解模型內部到底在做什麼」的工程師
- 「智慧增強」的論點：AI 是認知義肢，不是認知替身
- 每位工程師都要面對的職涯問題：去編排（orchestrate）代理人，還是去學到比它們更深？
- 「高維拼貼」——為什麼 Norden 認為「未經增強的人類認知」單獨無法航行今日全球問題的尺度
- 研究生物神經網路（Chen Lab）揭露了什麼，是多數 AI 開發者從未考慮過的
- 把拉赫曼尼諾夫、USTA 網球，與反向傳播連在一起的那些迭代式回饋迴圈

---

## 「從零打造」的哲學

為什麼 William 拒絕信任自己沒寫過的程式碼。這個論點不是懷舊——而是：在不理解的前提下使用抽象層，會養出一批「框架一壞就無法 debug 自己系統」的工程師。用 C 打造神經網路會強迫你坐下來，與反向傳播、記憶體配置、數值穩定性這些原本被框架藏起來的東西相處。這個取捨是「速度換深度」，而 Norden 主張：深度會複利。

## 神經型態運算、Spiking Neural Networks 與邊緣 AI

「打造受大腦啟發的運算系統」實際上是什麼意思。神經型態晶片運行神經網路的方式並不像 GPU——它們是事件驅動、稀疏的，並且極度省電，通常圍繞著 Spiking Neural Networks 與 mem-devices 建構。這對邊緣 AI 很關鍵：推論在裝置上發生，不在資料中心。Norden 的研究探討的是：當智慧運行在「邊緣」，而不是躲在某個 API 之後時，會解鎖什麼。

## 智慧增強，而不是替代

AI 對話裡的那個哲學分岔。「替代」這個框架（「AI 會替你做這份工作」）很大聲。「增強」這個框架——AI 是一具認知義肢——才是 Norden 押注的那一邊。它形塑了他設計系統的方式，也形塑了他怎麼回答每位工程師現在都在問的職涯問題：去編排代理人，還是去學到比它們更深？

## 高維拼貼

為什麼 Norden 認為今日全球問題的尺度，已經超出「未增強的人類認知」單獨能航行的範圍——以及這對 AI 該扮演的角色來說，代表什麼。這正是「往深處走」的論點，與「打造延伸我們的工具」的論點交會的地方。

## 生物神經網路（Chen Lab）

研究真正的大腦，揭露了多數人造神經網路所內建的、未被質疑過的假設。來自認知神經科學的洞察，是多數 AI 開發者從未考慮過的——以及它們對下一代模型設計來說，代表什麼。

## 拉赫曼尼諾夫、USTA 網球，與反向傳播

把俄式鋼琴教學法、競技網球與神經網路訓練內部機制連在一起的那些迭代式回饋迴圈。為什麼你在工程之外所鍛鍊的學科，會形塑你最後成為什麼樣的工程師。

---

## 節目筆記

William Norden 是聖塔克拉拉大學的研究工程師，工作橫跨神經型態運算、認知神經科學與硬體層的邊緣 AI。他的工作包含：Spiking Neural Networks 與 mem-devices 的研究、與 Chen Lab 合作的生物神經網路研究、在 Renesas Electronics 用 C 為嵌入式微控制器打造的深度強化學習程式庫、DeepRune（推進 Google AlphaChip 用於 VLSI 平面佈線），以及 MultiSim（為機器人研究進行的基於物理的環境模擬）。他最廣為人知的個人作品是 MNIST.c——一個完全用 C 手寫、不依賴任何函式庫、準確率超過 98% 的神經網路。在這場對話裡，他主張：下一個世代的 AI 工程師，與其說是被「編排代理人的能力」定義，不如說是被「理解底層系統的能力」定義。

### 文章與研究

本集沒有引用任何外部研究。

### 工具與資源

- **MNIST.c**——Norden 完全用 C 手寫、不依賴任何函式庫、在 MNIST 上達到 98% 以上準確率的神經網路
- **DeepRune**——Norden 推進 Google AlphaChip 用於 VLSI 平面佈線的工作
- **MultiSim**——為機器人研究進行的基於物理的環境模擬
- **Renesas Electronics**——Norden 在這裡用 C 為嵌入式微控制器打造了一套深度強化學習程式庫
- **Chen Lab（聖塔克拉拉大學）**——研究生物神經網路的認知神經科學實驗室
- **Spiking Neural Networks 與 mem-devices**——神經型態硬體背後、受大腦啟發的運算基元

### 相關 Still Human 集數

從第一性原理思考 AI、工程，以及「該真正理解什麼」的開發者：

- *執行力文化——Sean Wu 談為機器人募資 200 萬美元與模擬到現實的差距* — [oshenstudio.com/episode/execution-culture-sean-wu-synphony-robotics](https://oshenstudio.com/episode/execution-culture-sean-wu-synphony-robotics)
- *為太空裝紅綠燈——Lilian Krengel 談 AI、軌道擁塞與學生創業* — [oshenstudio.com/episode/space-traffic-management-ai-lilian-krengel-orbitguard](https://oshenstudio.com/episode/space-traffic-management-ai-lilian-krengel-orbitguard)
- *Toby Corey：禪式創業與在 AI 中建立信任* — [oshenstudio.com/episode/zentrepreneurship-toby-corey-brandcapsule-ai-trust](https://oshenstudio.com/episode/zentrepreneurship-toby-corey-brandcapsule-ai-trust)
- *還沒準備好，就先動手——Andrey Marey 談高自主性、紀律，與拒絕讓 AI 介入友誼* — [oshenstudio.com/episode/high-agency-andrey-marey-student-founder](https://oshenstudio.com/episode/high-agency-andrey-marey-student-founder)

---

## 關於 William Norden

William Norden 是聖塔克拉拉大學的研究工程師，工作橫跨神經型態運算（Spiking Neural Networks、mem-devices）、認知神經科學（Chen Lab），以及硬體層的邊緣 AI（Renesas Electronics）。他透過 DeepRune 推進 Google 的 AlphaChip 用於 VLSI 平面佈線，並透過 MultiSim 為機器人模擬基於物理的環境。他最廣為人知的個人作品 MNIST.c，是一個完全用 C 手寫、不依賴任何函式庫、準確率超過 98% 的神經網路。Norden 同時是受俄式古典訓練的鋼琴家，也是 USTA 等級的網球選手——他把同一套迭代式、刻意練習的回饋迴圈帶進工程裡。他的論點簡單，但不流行：在一個「編排」當道的時代，最後贏的工程師，是那些真正理解自己所打造系統的底層的人。

---

## 收聽完整對話

在 [Spotify](https://open.spotify.com/episode/2dfdMSUOXFocn3XFt4wwA2)、[Apple Podcasts](https://podcasts.apple.com/us/podcast/still-human/id1795315498)，或 [YouTube](https://www.youtube.com/watch?v=qlTFxDjGnmk) 收聽完整對話。或在 [Substack](https://substack.com/@perkin0909) 閱讀完整逐字稿。

---

## 與 William Norden 聯絡

- 觀看本集：[youtube.com/watch?v=qlTFxDjGnmk](https://www.youtube.com/watch?v=qlTFxDjGnmk)

---

## 追蹤 Still Human Podcast

Still Human 是 [Oshen Studio](https://oshenstudio.com) 製作的雙週 Podcast，由 Perkin 主持——探討在 AI 時代裡，如何保有人性。與真正在現實中做事的創業者、創作者、創辦人與思考者進行的真實對話。每兩週在 YouTube、Spotify、Substack 與 LinkedIn 推出新一集。

- YouTube：[youtube.com/@Oshen.studio](https://youtube.com/@Oshen.studio)
- Instagram：[instagram.com/perkin0909](https://instagram.com/perkin0909)
- 在任何地方收聽：在 Spotify、Apple Podcasts，或你慣用的平台搜尋 **Still Human Podcast**

每兩週推出新一集。訂閱，就不會錯過任何一場對話。
