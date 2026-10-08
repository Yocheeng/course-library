# 題庫內容檢視與修正

日期：2026-10-08

## 範圍與結果

檢視現有 550 題（作業系統 370、演算法 180）的題幹、答案與解析。這次重寫或補強 252 題解析：作業系統 131 題、演算法 121 題；修正 12 題的答案、措辭或數學表示。題數、題目順序、穩定 ID、題幹與原選項均保留，既有待複習標記與題目連結仍可使用。

有完整條件時，解析用定義、推導或反例說明；涉及實作差異時補上版本或平台。需要原題、分類範圍或其他條件的 50 題，明列疑點或缺少的資料，暫停自動判分。這不代表這 50 題全部答錯，也不代表其餘題目已得到學校確認。

「待確認」篩選目前有作業系統 35 題、演算法 56 題：除了上述 50 題，還涵蓋原資料未附選項及既有核對提醒。

## 後續用詞校訂與閱讀調整

本次另校訂 69 題解析（作業系統 63、演算法 6），包括「隻有／隻存在」的錯字，以及「程式設計師、資料、變數、介面、呼叫、排程、預設、實作」等用詞的一致性。這是對現有解析的後續整理，不與先前補強的 252 題直接相加。

其中 25 題改為「核心觀念」「判讀步驟／解題步驟」「適用條件」三段，涵蓋較長解析，以及 OpenMP、implicit threading 等容易混淆的內容。保留題意疑點與適用版本，不改動題幹、選項、答案、題序與穩定 ID。

搜尋結果現在標示命中區域；遮答模式不因搜尋而顯示解析內容。手機版縮短標題與工具區，將篩選入口和模式切換排在同列；重複的範圍說明僅保留供輔助科技讀取。

檢查涵蓋兩科的遮答搜尋、多關鍵字命中、320px／390px 手機與 1280px 桌面畫面，以及大字模式與設定的 Escape 操作。所查看畫面未見水平溢出或 JavaScript 頁面錯誤；550 題資料只調整解析及相關名詞文字。

## 修正原則

- 已能推導或明確辨識的錯誤，更新目前答案，保留 `originalAnswer`，畫面可展開查看修正前答案。
- 題意不能唯一判斷時保留來源答案並標明待確認，不以它自動判定對錯。
- 文字題的數學意思與學校輸入格式分開說明，不將格式提示充當解析。
- 參考連結集中保留在本文件，題目畫面不顯示參考資料區塊。參考來源為相關教材或官方文件；本站推導與反例以自己的文字呈現。來源宣稱的 LMS 判分未經本站登入學校系統核實。

## 12 題答案或表示法調整

| 題目 | 修正前 | 目前答案 |
| --- | --- | --- |
| [作業系統 basics 第 9 題](https://yocheng06.github.io/course-library/os.html?question=basics-9) | B、C | A、B、C、D |
| [作業系統 basics 第 29 題](https://yocheng06.github.io/course-library/os.html?question=basics-29) | A、B | A. Mode bit |
| [作業系統 architecture 第 31 題](https://yocheng06.github.io/course-library/os.html?question=architecture-31) | A、B、C | A、B |
| [作業系統 process 第 11 題](https://yocheng06.github.io/course-library/os.html?question=process-11) | process control block | task control block |
| [作業系統 process 第 12 題](https://yocheng06.github.io/course-library/os.html?question=process-12) | process control block | task control block |
| [作業系統 threads 第 18 題](https://yocheng06.github.io/course-library/os.html?question=threads-018) | A、B、C、D | D. Two-level（題幹仍需確認） |
| [作業系統 threads 第 84 題](https://yocheng06.github.io/course-library/os.html?question=threads-084) | A、B、C、D | A. Two-level（題幹仍需確認） |
| [演算法 L2 第 22 題](https://yocheng06.github.io/course-library/algorithms.html?question=L2-022) | O(logn)^k | O((log n)^k) |
| [演算法 L2 第 25 題](https://yocheng06.github.io/course-library/algorithms.html?question=L2-025) | A、B、D | A、D |
| [演算法 L2 第 26 題](https://yocheng06.github.io/course-library/algorithms.html?question=L2-026) | A、C、D | A、C |
| [演算法 L4 第 3 題](https://yocheng06.github.io/course-library/algorithms.html?question=L4-003) | T(n)<=T(2n/3)+big_theta(1) | T(n)<=T(2n/3)+big-theta(1) |
| [演算法 L4 第 6 題](https://yocheng06.github.io/course-library/algorithms.html?question=L4-006) | greater | greater than or equal to（題幹仍需確認） |

Two-level 綁定題與 Max-Heap 的 greater 填空仍需確認題幹限定；雖提供較精確的教材答案，這三題暫不自動判分。

## 主要解析補強

- 漸進符號：區分函式上／下界與最好／最壞情況，補上正常數與函式範圍。
- 數學性質：用 x=0、x=1 的反例處理不等式，補上 floor／ceiling 的除數條件；階乘與 Fibonacci 說明成長率來源。
- 排序：推導插入排序的等差級數、Merge Sort 每層成本、Build-Max-Heap 按高度加總；說明穩定性與遞迴堆疊空間。
- 遞迴：補齊大師定理的多項式級差距與規則性條件、歸納基底、平移／對數變數代換。
- 程序與執行緒：說明 PCB 別名、模式位元與特權指令的差別、不同執行緒模型的阻塞與平行限制。
- 平台更新：區分 Android Dalvik／ART、Java 原生／虛擬執行緒、早期 Chrome 外掛程序、iPad 多前景場景、Windows named pipe 與 Linux FIFO。

## 仍需原題或條件的 50 題

可在網站選「全部單元」及「待確認」尋找。以下連結會直接定位到題目。

| 題目 | 疑點／需要補充 |
| --- | --- |
| [作業系統 architecture 第 6 題](https://yocheng06.github.io/course-library/os.html?question=architecture-6) | 題幹把「通常有使用者介面」寫成特定 CLI，缺少可核實的範圍。 |
| [作業系統 architecture 第 20 題](https://yocheng06.github.io/course-library/os.html?question=architecture-20) | 背景服務可屬系統程式；來源答案 D 與教材分類衝突。 |
| [作業系統 architecture 第 21 題](https://yocheng06.github.io/course-library/os.html?question=architecture-21) | C 未區分核心 CPU 排程與背景工作排程，需確認原文。 |
| [作業系統 architecture 第 29 題](https://yocheng06.github.io/course-library/os.html?question=architecture-29) | 選項 D 將 account management 與 accounting 混用。 |
| [作業系統 architecture 第 58 題](https://yocheng06.github.io/course-library/os.html?question=architecture-58) | 原答案 sleep() 分類有誤；目前選項未提供明確的資訊維護操作。 |
| [作業系統 architecture 第 71 題](https://yocheng06.github.io/course-library/os.html?question=architecture-71) | 「第一個」缺少歷史範圍與來源；Mach 可確認是重要早期專案。 |
| [作業系統 architecture 第 73 題](https://yocheng06.github.io/course-library/os.html?question=architecture-73) | 未明確區分整體 OS 設計與核心架構的 hybrid 分類。 |
| [作業系統 architecture 第 84 題](https://yocheng06.github.io/course-library/os.html?question=architecture-84) | A 的「覆蓋整個記憶體」不是正常執行的必然行為，需核對原題。 |
| [作業系統 architecture 第 113 題](https://yocheng06.github.io/course-library/os.html?question=architecture-113) | DTrace 與 top 都可即時觀察效能，現有單選題幹未限定摘要型監控工具。 |
| [作業系統 process 第 46 題](https://yocheng06.github.io/course-library/os.html?question=process-46) | 題幹問可能原因，D 也可能成立；來源答案依特定教材清單排除 D。 |
| [作業系統 process 第 52 題](https://yocheng06.github.io/course-library/os.html?question=process-52) | 未限定教材列舉，不能單憑清單排除 efficiency。 |
| [作業系統 process 第 53 題](https://yocheng06.github.io/course-library/os.html?question=process-53) | 未限定教材列舉，不能單憑清單排除 efficiency。 |
| [作業系統 process 第 55 題](https://yocheng06.github.io/course-library/os.html?question=process-55) | 未限定本機 OS 範例；Java RMI 也使用訊息交換。 |
| [作業系統 process 第 70 題](https://yocheng06.github.io/course-library/os.html?question=process-70) | 題幹把 non-blocking 寫成 synchronous，與教材分類矛盾。 |
| [作業系統 process 第 78 題](https://yocheng06.github.io/course-library/os.html?question=process-78) | 未指定平臺或開啟模式，具名管道不一定雙向。 |
| [作業系統 process 第 79 題](https://yocheng06.github.io/course-library/os.html?question=process-79) | 未指定平臺或開啟模式，具名管道不一定雙向。 |
| [作業系統 process 第 80 題](https://yocheng06.github.io/course-library/os.html?question=process-80) | 未指定平臺或開啟模式，具名管道不一定雙向。 |
| [作業系統 process 第 81 題](https://yocheng06.github.io/course-library/os.html?question=process-81) | 未指定平臺或開啟模式，具名管道不一定雙向。 |
| [作業系統 process 第 91 題](https://yocheng06.github.io/course-library/os.html?question=process-91) | 未指定版本與裝置，單一前景程序不是所有現代 Apple 行動系統的通則。 |
| [作業系統 process 第 92 題](https://yocheng06.github.io/course-library/os.html?question=process-92) | 未指定版本與裝置，單一前景程序不是所有現代 Apple 行動系統的通則。 |
| [作業系統 process 第 93 題](https://yocheng06.github.io/course-library/os.html?question=process-93) | 原答案採早期外掛架構，題幹未指定 Chrome 版本。 |
| [作業系統 process 第 97 題](https://yocheng06.github.io/course-library/os.html?question=process-97) | B「行程」與 C「程序」都是 process 的譯名，單選無法唯一判斷。 |
| [作業系統 process 第 98 題](https://yocheng06.github.io/course-library/os.html?question=process-98) | A 把 Thread 譯成行程，造成與 process 的術語混淆。 |
| [作業系統 process 第 104 題](https://yocheng06.github.io/course-library/os.html?question=process-104) | 題幹把 non-blocking 寫成 synchronous，與教材分類矛盾。 |
| [作業系統 process 第 110 題](https://yocheng06.github.io/course-library/os.html?question=process-110) | 原答案採早期外掛架構，題幹未指定 Chrome 版本。 |
| [作業系統 threads 第 18 題](https://yocheng06.github.io/course-library/os.html?question=threads-018) | 題幹未限定是否指多對多模型額外提供的專屬綁定功能，需核對原題。 |
| [作業系統 threads 第 31 題](https://yocheng06.github.io/course-library/os.html?question=threads-031) | C 對自動區域變數也可能成立，D 則需排除 static 區域變數；原題範圍不足。 |
| [作業系統 threads 第 84 題](https://yocheng06.github.io/course-library/os.html?question=threads-084) | 題幹未限定是否指多對多模型額外提供的專屬綁定功能，需核對原題。 |
| [演算法 L2 第 8 題](https://yocheng06.github.io/course-library/algorithms.html?question=L2-008) | 題幹混同上／下界與最壞／最佳情況；需確認原題實際要填的符號。 |
| [演算法 L2 第 16 題](https://yocheng06.github.io/course-library/algorithms.html?question=L2-016) | 題幹未交代 a、b 的範圍；D 需補上正整數等適用條件。 |
| [演算法 L2 第 48 題](https://yocheng06.github.io/course-library/algorithms.html?question=L2-048) | 缺少帶行號的 Insertion Sort 虛擬碼與各行執行次數表。 |
| [演算法 L2 第 49 題](https://yocheng06.github.io/course-library/algorithms.html?question=L2-049) | 缺少帶行號的 Insertion Sort 虛擬碼與各行成本表。 |
| [演算法 L3 第 10 題](https://yocheng06.github.io/course-library/algorithms.html?question=L3-034) | 選項「無法進行代數變換」含義不明，需核對原文是否指代數推導困難。 |
| [演算法 L3 第 19 題](https://yocheng06.github.io/course-library/algorithms.html?question=L3-016) | 題幹缺少每層成本的量級，無法選出唯一總成本。 |
| [演算法 L3 第 20 題](https://yocheng06.github.io/course-library/algorithms.html?question=L3-017) | 未給遞迴式或葉節點數，葉層總成本不一定為線性。 |
| [演算法 L3 第 30 題](https://yocheng06.github.io/course-library/algorithms.html?question=L3q-11c3767f47ff) | 「慢於 O(n^(log_b a))」不夠精確；缺少多項式級差距條件。 |
| [演算法 L3 第 32 題](https://yocheng06.github.io/course-library/algorithms.html?question=L3q-a0628258a256) | A 是 B 的特例；目前單選題幹未明確限定通用標準形式。 |
| [演算法 L3 第 33 題](https://yocheng06.github.io/course-library/algorithms.html?question=L3-023) | D 未限定 Case 1／3；需確認課程採用的大師定理版本。 |
| [演算法 L3 第 39 題](https://yocheng06.github.io/course-library/algorithms.html?question=L3q-e529090709c4) | 題幹漏了多項式級差距與規則性條件，不能只看「大於」。 |
| [演算法 L3 第 59 題](https://yocheng06.github.io/course-library/algorithms.html?question=L3q-aa439b2239eb) | 題幹只有顯式解，疑似漏了原始遞迴式。 需提供原題的完整遞迴式與基底條件。 |
| [演算法 L4 第 6 題](https://yocheng06.github.io/course-library/algorithms.html?question=L4-006) | 原題單字填空不足以表達允許相等的堆積性質。 |
| [演算法 L4 第 16 題](https://yocheng06.github.io/course-library/algorithms.html?question=L4-016) | 缺少目前完整陣列、i、heap-size 與程式停留位置。 |
| [演算法 L4 第 17 題](https://yocheng06.github.io/course-library/algorithms.html?question=L4-017) | 缺少目前完整陣列、i、heap-size 與程式停留位置。 |
| [演算法 L4 第 18 題](https://yocheng06.github.io/course-library/algorithms.html?question=L4-018) | 缺少完整陣列、目前 i、heap-size，以及是在交換前或修復後的圖示。 |
| [演算法 L4 第 19 題](https://yocheng06.github.io/course-library/algorithms.html?question=L4-019) | 缺少完整陣列、目前 i、heap-size，以及是在交換前或修復後的圖示。 |
| [演算法 L4 第 41 題](https://yocheng06.github.io/course-library/algorithms.html?question=L4-041) | 原答案把非普遍成立的理由全列為正確；又缺少原選項與比較情境。 |
| [演算法 L4 第 43 題](https://yocheng06.github.io/course-library/algorithms.html?question=L4-043) | 原答案只列最初三個節點，原題未交代問的是首次比較還是完整影響範圍。 |
| [演算法 L4 第 46 題](https://yocheng06.github.io/course-library/algorithms.html?question=L4-046) | 缺少 Min-Max Heap 原樹圖、問號位置與候選值。 |
| [演算法 L4 第 47 題](https://yocheng06.github.io/course-library/algorithms.html?question=L4-047) | 缺少附行號的 Max-Heapify 虛擬碼與原選項。 |
| [演算法 L4 第 53 題](https://yocheng06.github.io/course-library/algorithms.html?question=L4-053) | 題幹未限定遞迴版，來源答案中的「使用遞迴」不是必要性質。 |

## 維護時的優先順序

1. 補上 L2 第 48、49 題的行號虛擬碼與成本表；L3 第 59 題的原始遞迴式；L4 第 16–19、46、47 題的完整圖與程式碼。
2. 取得所有 L4 選擇題原選項。未附選項的題目仍可練習觀念，但無法可靠核對原選項或題意。
3. 確認平台答案與教材有差異的題目，特別是 Two-level 綁定、interrupt 分類、PCB 別名；學校答案若不同，應分開記錄考試鍵與概念答案。
4. 日後新增題目至少附：完整題幹、選項／題圖、答案、解題理由、適用條件與可核對來源。

## 參考資料

- [MIT：漸進分析與遞迴關係式](https://ocw.mit.edu/courses/6-046j-introduction-to-algorithms-sma-5503-fall-2005/81d240e8db219502712349254cdd5272_whjt_N9uYFI.pdf)
- [MIT：Binary Heaps](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-8-binary-heaps/)
- [Operating System Concepts：系統結構](https://www.cs.umd.edu/class/spring2020/cmsc412/Slides/Set3%20-Chapter%202.pdf)
- [Operating System Concepts：程序管理與 PCB](https://os.ecci.ucr.ac.cr/slides/9th-Edition/2012-pdf/ch03.pdf)
- [UIC：Threads](https://www.cs.uic.edu/~jbell/CourseNotes/OperatingSystems/4_Threads.html)
- [Linux：fork](https://man7.org/linux/man-pages/man2/fork.2.html)、[Pipes／FIFOs](https://man7.org/linux/man-pages/man7/pipe.7.html)、[Signals](https://man7.org/linux/man-pages/man7/signal.7.html)
- [Microsoft：Named Pipes](https://learn.microsoft.com/en-us/windows/win32/ipc/named-pipes)
- [Android：平台架構](https://developer.android.com/guide/platform)
- [OpenJDK JEP 444：Virtual Threads](https://openjdk.org/jeps/444)
- [Chromium：多程序架構](https://www.chromium.org/developers/design-documents/multi-process-architecture/)
- [Apple：多工與多場景](https://developer.apple.com/documentation/uikit/multitasking-on-ipad-mac-and-apple-vision-pro)

## 檢查記錄

- 550 題的數量與穩定 ID 和修正前一致，沒有改動題幹、原選項與題序。
- 12 題修改前答案均另存供對照。
- 修改的 JavaScript 通過語法檢查，Git diff 無空白格式錯誤。
- 抽看 390px 手機與 1280px 桌面上的修正題目、來源答案與參考連結，未見水平溢出或 JavaScript 頁面錯誤。
- 未新增或執行自動化測試套件。
