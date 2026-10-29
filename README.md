-- First Toolbox extracted from StudioRX.Lua (Ezy V1)
-- Original UI settings, categories, assets, storage names, and insertion behavior are retained.
-- Only a small public open/close/toggle API is added at the end for standalone use.
local function loadFirstToolbox()
    local openTbPanel, closeTbPanel, tbPanelOpen
    local openTPanel, closeTPanel, tPanelOpen
    local grassColorOpenBtn


    local Players2 = game:GetService("Players")
    local TweenService = game:GetService("TweenService")
    local RunService = game:GetService("RunService")
    local HttpService = game:GetService("HttpService")

    local Player = Players2.LocalPlayer
    local PlayerGui2 = Player:WaitForChild("PlayerGui", 5)
    local mouse = Player:GetMouse()
    local Terrain = workspace.Terrain

    local C2 = {
        BG      = Color3.fromRGB(10, 10, 14),
        SURFACE = Color3.fromRGB(18, 18, 24),
        CARD    = Color3.fromRGB(24, 24, 32),
        CARD2   = Color3.fromRGB(32, 32, 44),
        BORDER  = Color3.fromRGB(48, 48, 66),
        BORDBRT = Color3.fromRGB(70, 70, 95),
        TEXT    = Color3.fromRGB(228, 228, 238),
        SUBTEXT = Color3.fromRGB(100, 100, 128),
        WHITE   = Color3.fromRGB(255, 255, 255),
        BLUE    = Color3.fromRGB(60, 120, 255),
        RED     = Color3.fromRGB(205, 42, 55),
        GREEN   = Color3.fromRGB(30, 160, 80),
        YELLOW  = Color3.fromRGB(210, 165, 25),
        ORANGE  = Color3.fromRGB(210, 100, 20),
        CYAN    = Color3.fromRGB(40, 200, 220),
        PURPLE  = Color3.fromRGB(120, 80, 220),
    }


    local function mkCorner(r, p)
        local c = Instance.new("UICorner"); c.CornerRadius = UDim.new(0, r); c.Parent = p; return c
    end
    local function mkStroke(t, col, p)
        local s = Instance.new("UIStroke"); s.Thickness = t; s.Color = col; s.Parent = p; return s
    end
    local function mkPad(top, bot, left, right, p)
        local pad = Instance.new("UIPadding")
        pad.PaddingTop = UDim.new(0,top); pad.PaddingBottom = UDim.new(0,bot)
        pad.PaddingLeft = UDim.new(0,left); pad.PaddingRight = UDim.new(0,right)
        pad.Parent = p; return pad
    end

    local function makeDraggable2(handle, target)
        target = target or handle
        local drag, ds, sp = false, nil, nil
        handle.InputBegan:Connect(function(i)
            if i.UserInputType == Enum.UserInputType.MouseButton1 or i.UserInputType == Enum.UserInputType.Touch then
                drag=true; ds=i.Position; sp=target.Position
                i.Changed:Connect(function()
                    if i.UserInputState == Enum.UserInputState.End then drag=false end
                end)
            end
        end)
        handle.InputChanged:Connect(function(i)
            if drag and (i.UserInputType == Enum.UserInputType.MouseMovement or i.UserInputType == Enum.UserInputType.Touch) then
                local d = i.Position - ds
                TweenService:Create(target, TweenInfo.new(0), {
                    Position = UDim2.new(sp.X.Scale, sp.X.Offset+d.X, sp.Y.Scale, sp.Y.Offset+d.Y)
                }):Play()
            end
        end)
    end

    local function drawLine2(parent, x1,y1,x2,y2, thick, color)
        local dx,dy = x2-x1, y2-y1
        local len = math.sqrt(dx*dx+dy*dy)
        if len < 0.5 then return end
        local bar = Instance.new("Frame")
        bar.Size = UDim2.new(0, math.ceil(len), 0, thick)
        bar.Position = UDim2.new(0, math.floor((x1+x2)/2-len/2), 0, math.floor((y1+y2)/2-thick/2))
        bar.Rotation = math.deg(math.atan2(dy,dx))
        bar.BackgroundColor3 = color or C2.BLUE
        bar.BorderSizePixel = 0; bar.ZIndex = 120; bar.Parent = parent
    end
    local function drawDot2(parent, cx,cy,r,color)
        local d = Instance.new("Frame")
        d.Size = UDim2.new(0,r*2,0,r*2); d.Position = UDim2.new(0,cx-r,0,cy-r)
        d.BackgroundColor3 = color or C2.BLUE; d.BorderSizePixel=0; d.ZIndex=120; d.Parent=parent
        mkCorner(r,d)
    end

    local function iconToolbox2(f,S)
        local m=3
        drawLine2(f,m,m+5,S-m,m+5,1.5,C2.BLUE); drawLine2(f,S-m,m+5,S-m,S-m,1.5,C2.BLUE)
        drawLine2(f,S-m,S-m,m,S-m,1.5,C2.BLUE); drawLine2(f,m,S-m,m,m+5,1.5,C2.BLUE)
        drawLine2(f,S/2-4,m+5,S/2-4,m,1.5,C2.WHITE); drawLine2(f,S/2+4,m+5,S/2+4,m,1.5,C2.WHITE)
        drawLine2(f,S/2-4,m,S/2+4,m,1.5,C2.WHITE)
        drawLine2(f,m,(m+5+S-m)/2,S-m,(m+5+S-m)/2,1,C2.SUBTEXT)
        drawLine2(f,S/2,m+5,S/2,S-m,1,C2.SUBTEXT)
        drawDot2(f,S/2-3,(m+5+(m+5+S-m)/2)/2,1.5,C2.CYAN); drawDot2(f,S/2+3,(m+5+(m+5+S-m)/2)/2,1.5,C2.CYAN)
        drawDot2(f,S/2-3,((m+5+S-m)/2+S-m)/2,1.5,C2.PURPLE); drawDot2(f,S/2+3,((m+5+S-m)/2+S-m)/2,1.5,C2.PURPLE)
    end
    local function iconTerrain2(f,S)
        local bot=S-3
        drawLine2(f,3,bot,S-3,bot,1.5,C2.GREEN)
        drawLine2(f,3,bot,S/2-1,S/2-2,1.5,C2.BLUE); drawLine2(f,S/2-1,S/2-2,S/2+4,bot-4,1.5,C2.BLUE)
        drawLine2(f,S/2+2,bot-5,S-3,4,1.5,C2.CYAN); drawLine2(f,S-3,4,S-3,bot,1.5,C2.CYAN)
        drawLine2(f,S-3,4,S-6,7,1,C2.WHITE); drawLine2(f,S-3,4,S-1,7,1,C2.WHITE)
        drawDot2(f,6,5,2,C2.YELLOW); drawLine2(f,6,2,6,3,1,C2.YELLOW); drawLine2(f,9,5,10,5,1,C2.YELLOW)
    end


    local FILE_NAME    = "ezy_toolbox_v87.json"
    local FILE_DELETED = "ezy_deleted_v87.json"
    local FILE_GRASS   = "ezy_grass_color_v87.json"
    local toolboxItems = {}

    local DEFAULT_ITEMS = {
        {id="4926139544",          name="Part Trampoline",       category="Model"},
        {id="11324928349",         name="Lamp",                  category="Model"},
        {id="120813293048698",     name="Podium",                category="Model"},
        {id="94304441802173",      name="Village Low Poly",      category="Model"},
        {id="131232802624216",     name="Text",                  category="Model"},
        {id="5526968660",          name="Pilar Bunga",           category="Model"},
        {id="574502744",           name="Jembatan",              category="Model"},
        {id="136224194594300",     name="Part Bulet Biru",       category="Model"},
        {id="91824881894906",      name="Pilar Biru",            category="Model"},
        {id="18385401040",         name="Jamur 1",               category="Model"},
        {id="5465044187",          name="Jamur 2",               category="Model"},
        {id="5465008653",          name="Jamur 3",               category="Model"},
        {id="14405338498",         name="Pohon Biru",            category="Model"},
        {id="101093196873917",     name="Pilar Putih",           category="Model"},
        {id="13717277279",         name="Pagar",                 category="Model"},
        {id="108969178728061",     name="Coil Mount Luna",       category="Model"},
        {id="71816321170147",      name="Fitur P Balap",         category="Model"},
        {id="94599287071471",      name="Ayunan Pink",           category="Model"},
        {id="99774552211130",      name="Lampion",               category="Model"},
        {id="103932300220382",     name="Efek Angin",            category="Model"},
        {id="130556119417198",     name="Efek Hujan",            category="Model"},
        {id="107568096083006",     name="Pulau Terapung",        category="Model"},
        {id="78758196076694",      name="Kerambit Coil",         category="Model"},
        {id="16491763998",         name="Text 3D",               category="Model"},
        {id="5539708469",          name="Pohon Hijau",           category="Model"},
        {id="4987585723",          name="Pagar Kayu",            category="Model"},
        {id="83282010441336",      name="Pohon Estetik",         category="Model"},
        {id="10936331751",         name="Kursi Raja",            category="Model"},
        {id="117717806718562",     name="Pohon Ungu",            category="Model"},
        {id="16444908253",         name="Waterfall",             category="Model"},
        {id="18849541324",         name="Logo Mount Neon",       category="Model"},
        {id="77237492468310",      name="Rintangan Nexora Full", category="Obstacle"},
        {id="104719917463159",     name="Tangga Mesh",           category="Obstacle"},
        {id="134505370549170",     name="Rintangan Donat",       category="Obstacle"},
    }

    local function fsWrite(path, data)
        pcall(function() if writefile then writefile(path, data) end end)
    end
    local function fsRead(path)
        local ok, result = pcall(function()
            if isfile and readfile and isfile(path) then return readfile(path) end
            return nil
        end)
        if ok and result then return result end
        return nil
    end


    local function loadGrassColor()
        local GRASS_FALLBACKS = {
            FILE_GRASS,
            "ezy_grass_color_v72.json","ezy_grass_color_v71.json","ezy_grass_color_v70.json",
            "ezy_grass_color_v69.json","ezy_grass_color_v68.json","ezy_grass_color_v64.json",
            "ezy_grass_color_v62.json","ezy_grass_color_v61.json","ezy_grass_color_v60.json",
            "ezy_grass_color_v58.json","ezy_grass_color_v57.json","ezy_grass_color_v56.json",
        }
        for _, fname in ipairs(GRASS_FALLBACKS) do
            local raw = fsRead(fname)
            if raw then
                local ok, result = pcall(function() return HttpService:JSONDecode(raw) end)
                if ok and result and type(result.r)=="number" then
                    if fname ~= FILE_GRASS then fsWrite(FILE_GRASS, HttpService:JSONEncode(result)) end
                    return result
                end
            end
        end
        return {r=106, g=127, b=63}
    end
    local function saveGrassColor(r,g,b)
        fsWrite(FILE_GRASS, HttpService:JSONEncode({r=r,g=g,b=b}))
    end
    local currentGrassColor = loadGrassColor()


    local function loadDeleted()
        local raw = fsRead(FILE_DELETED)
        if raw then
            local ok, result = pcall(function() return HttpService:JSONDecode(raw) end)
            if ok and type(result)=="table" then return result end
        end
        return {}
    end
    local function saveDeleted(tbl) fsWrite(FILE_DELETED, HttpService:JSONEncode(tbl)) end
    local deletedIds = loadDeleted()
    local function isDeletedDefault(id) return deletedIds[tostring(id)] == true end
    local function markDeletedDefault(id) deletedIds[tostring(id)] = true; saveDeleted(deletedIds) end


    local function saveItems()
        local data = {}
        for _, item in ipairs(toolboxItems) do
            if not item.isDefault then
                table.insert(data, { name=item.name, id=item.id, category=item.category })
            end
        end
        fsWrite(FILE_NAME, HttpService:JSONEncode(data))
    end
    local function loadItems()
        local FALLBACK_FILES = {
            FILE_NAME,
            "ezy_toolbox_v72.json","ezy_toolbox_v71.json","ezy_toolbox_v70.json",
            "ezy_toolbox_v69.json","ezy_toolbox_v68.json","ezy_toolbox_v67.json",
            "ezy_toolbox_v66.json","ezy_toolbox_v65.json","ezy_toolbox_v64.json",
            "ezy_toolbox_v63.json","ezy_toolbox_v62.json","ezy_toolbox_v61.json",
            "ezy_toolbox_v60.json","ezy_toolbox_v59.json","ezy_toolbox_v58.json",
            "ezy_toolbox_v57.json","ezy_toolbox_v56.json","ezy_toolbox_v54.json",
        }
        for _, fname in ipairs(FALLBACK_FILES) do
            local raw = fsRead(fname)
            if raw then
                local ok, result = pcall(function() return HttpService:JSONDecode(raw) end)
                if ok and type(result)=="table" and #result > 0 then
                    for _, v in ipairs(result) do if not v.category then v.category="Obstacle" end end
                    if fname ~= FILE_NAME then fsWrite(FILE_NAME, HttpService:JSONEncode(result)) end
                    return result
                end
            end
        end
        return {}
    end


    if PlayerGui2:FindFirstChild("EzyV1") then PlayerGui2.EzyV1:Destroy() end

    local mainGui = Instance.new("ScreenGui")
    mainGui.Name = "SlBlackProEzyV1"; mainGui.ResetOnSpawn = false
    mainGui.IgnoreGuiInset = true; mainGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
    mainGui.Parent = PlayerGui2

    local TOPBAR_H = 0


    local toast = Instance.new("Frame")
    toast.Size = UDim2.new(0,260,0,34); toast.Position = UDim2.new(0.5,-130,1,-56)
    toast.BackgroundColor3 = Color3.fromRGB(20,20,20); toast.BorderSizePixel=0
    toast.BackgroundTransparency=1; toast.ZIndex=800; toast.Parent=mainGui
    mkCorner(8,toast)
    local toastLbl = Instance.new("TextLabel")
    toastLbl.Size = UDim2.new(1,-12,1,0); toastLbl.Position = UDim2.new(0,6,0,0)
    toastLbl.BackgroundTransparency=1; toastLbl.Text=""; toastLbl.TextColor3=C2.WHITE
    toastLbl.TextSize=11; toastLbl.Font=Enum.Font.GothamBold; toastLbl.ZIndex=801; toastLbl.Parent=toast
    local function showToast(msg, col)
        col = col or Color3.fromRGB(20,20,20); toast.BackgroundColor3=col; toastLbl.Text=msg
        TweenService:Create(toast, TweenInfo.new(0.2), {BackgroundTransparency=0}):Play()
        task.wait(2); TweenService:Create(toast, TweenInfo.new(0.2), {BackgroundTransparency=1}):Play()
    end


    local function _toolbox()
        local tbPanel = Instance.new("Frame")
        tbPanel.Size = UDim2.new(0,380,0,480); tbPanel.Position = UDim2.new(0.5,-190,0,TOPBAR_H+4)
        tbPanel.BackgroundColor3 = C2.BG; tbPanel.BorderSizePixel=0; tbPanel.Visible=false; tbPanel.ZIndex=600
        tbPanel.Parent=mainGui; mkCorner(12,tbPanel); mkStroke(1.5,C2.BORDBRT,tbPanel)

        tbPanelOpen = false
        openTbPanel = function()
            tbPanelOpen=true; tbPanel.Visible=true; tbPanel.Size=UDim2.new(0,0,0,0)
            -- [P9] panel size is clamped to the screen so it never overflows small phones
            local sw = mainGui.AbsoluteSize.X; local sh = mainGui.AbsoluteSize.Y
            local pw = (sw > 0) and math.min(380, sw-16) or 380
            local ph = (sh > 0) and math.min(480, sh-TOPBAR_H-16) or 480
            tbPanel.Position=UDim2.new(0.5,-pw/2,0,TOPBAR_H+4)
            TweenService:Create(tbPanel,TweenInfo.new(0.2,Enum.EasingStyle.Quad,Enum.EasingDirection.Out),{Size=UDim2.new(0,pw,0,ph)}):Play()
        end
        closeTbPanel = function()
            tbPanelOpen=false
            local t=TweenService:Create(tbPanel,TweenInfo.new(0.15,Enum.EasingStyle.Quad,Enum.EasingDirection.In),{Size=UDim2.new(0,0,0,0)})
            t:Play(); t.Completed:Connect(function() tbPanel.Visible=false end)
        end

        local tbHeader = Instance.new("Frame")
        tbHeader.Size=UDim2.new(1,0,0,38); tbHeader.BackgroundColor3=C2.SURFACE; tbHeader.BorderSizePixel=0
        tbHeader.ZIndex=601; tbHeader.Parent=tbPanel; mkCorner(12,tbHeader); makeDraggable2(tbHeader,tbPanel)
        do
            local tbHeaderFill = Instance.new("Frame")
            tbHeaderFill.Size=UDim2.new(1,0,0,14); tbHeaderFill.Position=UDim2.new(0,0,1,-14)
            tbHeaderFill.BackgroundColor3=C2.SURFACE; tbHeaderFill.BorderSizePixel=0; tbHeaderFill.ZIndex=601; tbHeaderFill.Parent=tbHeader
        end
        do
            local tbHIconF = Instance.new("Frame")
            tbHIconF.Size=UDim2.new(0,18,0,18); tbHIconF.Position=UDim2.new(0,10,0.5,-9)
            tbHIconF.BackgroundTransparency=1; tbHIconF.ClipsDescendants=false; tbHIconF.ZIndex=610; tbHIconF.Parent=tbHeader
            iconToolbox2(tbHIconF,18)
        end
        do
            local tbTitle = Instance.new("TextLabel")
            tbTitle.Size=UDim2.new(1,-50,1,0); tbTitle.Position=UDim2.new(0,34,0,0)
            tbTitle.BackgroundTransparency=1; tbTitle.Text="TOOLBOX  â€” by Ezy V1"
            tbTitle.TextColor3=C2.TEXT; tbTitle.TextSize=11; tbTitle.Font=Enum.Font.GothamBold
            tbTitle.TextXAlignment=Enum.TextXAlignment.Left; tbTitle.ZIndex=602; tbTitle.Parent=tbHeader
        end
        do
            local closeTbBtn = Instance.new("TextButton")
            closeTbBtn.Size=UDim2.new(0,24,0,24); closeTbBtn.Position=UDim2.new(1,-30,0.5,-12)
            closeTbBtn.BackgroundColor3=C2.RED; closeTbBtn.BorderSizePixel=0; closeTbBtn.Text="âœ•"
            closeTbBtn.TextColor3=C2.WHITE; closeTbBtn.TextSize=11; closeTbBtn.Font=Enum.Font.GothamBold
            closeTbBtn.ZIndex=602; closeTbBtn.Parent=tbHeader; mkCorner(6,closeTbBtn)
            closeTbBtn.MouseButton1Click:Connect(closeTbPanel)
        end

        local tbContent = Instance.new("Frame")
        tbContent.Size=UDim2.new(1,0,1,-38); tbContent.Position=UDim2.new(0,0,0,38)
        tbContent.BackgroundTransparency=1; tbContent.ZIndex=601; tbContent.Parent=tbPanel

        local tabBar = Instance.new("Frame")
        tabBar.Size=UDim2.new(1,0,0,28); tabBar.Position=UDim2.new(0,0,0,0)
        tabBar.BackgroundColor3=C2.SURFACE; tabBar.BorderSizePixel=0; tabBar.ZIndex=602; tabBar.Parent=tbContent
        mkPad(3,3,4,4,tabBar)

        local tabSaved = Instance.new("TextLabel")
        tabSaved.Size=UDim2.new(1,0,1,0); tabSaved.BackgroundColor3=C2.BLUE; tabSaved.BorderSizePixel=0
        tabSaved.Text="ًں“¦ Tersimpan"; tabSaved.TextColor3=C2.WHITE; tabSaved.TextSize=10; tabSaved.Font=Enum.Font.GothamBold
        tabSaved.TextXAlignment=Enum.TextXAlignment.Center
        tabSaved.ZIndex=603; tabSaved.Parent=tabBar; mkCorner(6,tabSaved)

        local savedArea = Instance.new("Frame")
        savedArea.Size=UDim2.new(1,0,1,-28); savedArea.Position=UDim2.new(0,0,0,28)
        savedArea.BackgroundTransparency=1; savedArea.ZIndex=601; savedArea.Parent=tbContent

        local tbSide = Instance.new("Frame")
        tbSide.Size=UDim2.new(0,70,1,-88); tbSide.BackgroundColor3=C2.SURFACE; tbSide.BorderSizePixel=0
        tbSide.ZIndex=602; tbSide.Parent=savedArea

        local tbListArea = Instance.new("Frame")
        tbListArea.Size=UDim2.new(1,-75,1,-88); tbListArea.Position=UDim2.new(0,75,0,0)
        tbListArea.BackgroundTransparency=1; tbListArea.ZIndex=602; tbListArea.Parent=savedArea

        local categories = {"Model", "SummitKit", "Obstacle", "Sky"}
        local activeCategory = "Model"
        local categoryButtons = {}
        local lastY = 6
        for _, cat in ipairs(categories) do
            local btn = Instance.new("TextButton")
            btn.Size=UDim2.new(1,-8,0,28); btn.Position=UDim2.new(0,4,0,lastY)
            btn.BackgroundColor3=(cat=="Model") and C2.BLUE or C2.CARD2
            btn.BorderSizePixel=0; btn.Text=cat; btn.TextColor3=C2.TEXT; btn.TextSize=9
            btn.Font=Enum.Font.GothamBold; btn.ZIndex=603; btn.Parent=tbSide; mkCorner(6,btn)
            categoryButtons[cat]=btn; lastY=lastY+32
        end

        local itemScroll = Instance.new("ScrollingFrame")
        itemScroll.Size=UDim2.new(1,0,1,0); itemScroll.BackgroundTransparency=1; itemScroll.BorderSizePixel=0
        itemScroll.ScrollBarThickness=3; itemScroll.ScrollBarImageColor3=C2.BORDER
        itemScroll.ScrollingDirection=Enum.ScrollingDirection.Y; itemScroll.AutomaticCanvasSize=Enum.AutomaticSize.Y
        itemScroll.CanvasSize=UDim2.new(0,0,0,0); itemScroll.ElasticBehavior=Enum.ElasticBehavior.Never
        itemScroll.ZIndex=601; itemScroll.Parent=tbListArea
        do
            local itemLayout = Instance.new("UIListLayout"); itemLayout.Padding=UDim.new(0,3); itemLayout.SortOrder=Enum.SortOrder.LayoutOrder; itemLayout.Parent=itemScroll
        end

        local emptyLabel = Instance.new("TextLabel")
        emptyLabel.Size=UDim2.new(1,0,0,40); emptyLabel.BackgroundTransparency=1
        emptyLabel.Text="Belum ada item.\nKlik + Tambah untuk mulai!"; emptyLabel.TextColor3=C2.SUBTEXT
        emptyLabel.TextSize=11; emptyLabel.Font=Enum.Font.Gotham; emptyLabel.TextWrapped=true
        emptyLabel.ZIndex=602; emptyLabel.Parent=itemScroll

        local function refreshList()
            for _, child in ipairs(itemScroll:GetChildren()) do if child:IsA("Frame") then child:Destroy() end end
            local filtered = {}
            for _, item in ipairs(toolboxItems) do
                if item.category == activeCategory then table.insert(filtered, item) end
            end
            emptyLabel.Visible = (#filtered == 0)
            for _, item in ipairs(filtered) do
                local row = Instance.new("Frame")
                row.Size=UDim2.new(1,0,0,64); row.BackgroundColor3=C2.CARD; row.BorderSizePixel=0
                row.ZIndex=602; row.Parent=itemScroll; mkCorner(6,row); mkStroke(1,C2.BORDER,row)

                local icon = Instance.new("ImageLabel")
                icon.Size=UDim2.new(0,58,0,58); icon.Position=UDim2.new(0,4,0.5,-29)
                icon.BackgroundColor3=C2.CARD2; icon.BorderSizePixel=0
                icon.Image="rbxthumb://type=Asset&id="..tostring(item.id).."&w=150&h=150"
                icon.ScaleType=Enum.ScaleType.Fit; icon.ZIndex=603; icon.Parent=row; mkCorner(8,icon)
                local spinLbl = Instance.new("TextLabel")
                spinLbl.Size=UDim2.new(1,0,1,0); spinLbl.BackgroundTransparency=1
                spinLbl.Text="..."; spinLbl.TextColor3=C2.SUBTEXT; spinLbl.TextSize=9
                spinLbl.Font=Enum.Font.Gotham; spinLbl.ZIndex=604; spinLbl.Parent=icon
                icon:GetPropertyChangedSignal("IsLoaded"):Connect(function()
                    if icon.IsLoaded then spinLbl.Visible=false end
                end)
                if icon.IsLoaded then spinLbl.Visible=false end

                local nameLbl = Instance.new("TextLabel")
                nameLbl.Size=UDim2.new(1,-100,0,18); nameLbl.Position=UDim2.new(0,68,0,10)
                nameLbl.BackgroundTransparency=1; nameLbl.Text=item.name; nameLbl.TextColor3=C2.TEXT
                nameLbl.TextSize=11; nameLbl.Font=Enum.Font.GothamBold; nameLbl.TextXAlignment=Enum.TextXAlignment.Left
                nameLbl.TextTruncate=Enum.TextTruncate.AtEnd; nameLbl.ZIndex=603; nameLbl.Parent=row

                local idLbl = Instance.new("TextLabel")
                idLbl.Size=UDim2.new(1,-100,0,14); idLbl.Position=UDim2.new(0,68,0,32)
                idLbl.BackgroundTransparency=1; idLbl.Text="ID: "..tostring(item.id); idLbl.TextColor3=C2.SUBTEXT
                idLbl.TextSize=9; idLbl.Font=Enum.Font.Gotham; idLbl.TextXAlignment=Enum.TextXAlignment.Left
                idLbl.ZIndex=603; idLbl.Parent=row

                local copyBtn2 = Instance.new("TextButton")
                copyBtn2.Size=UDim2.new(0,46,0,28); copyBtn2.Position=UDim2.new(1,-80,0.5,-14)
                copyBtn2.BackgroundColor3=C2.BLUE; copyBtn2.BorderSizePixel=0
                copyBtn2.Text=(activeCategory=="Sky") and "Apply" or "Insert"
                copyBtn2.TextColor3=C2.WHITE; copyBtn2.TextSize=9; copyBtn2.Font=Enum.Font.GothamBold
                copyBtn2.ZIndex=604; copyBtn2.Parent=row; mkCorner(5,copyBtn2)

                local delBtn = Instance.new("TextButton")
                delBtn.Size=UDim2.new(0,26,0,28); delBtn.Position=UDim2.new(1,-30,0.5,-14)
                delBtn.BackgroundColor3=C2.RED; delBtn.BorderSizePixel=0; delBtn.Text="âœ•"
                delBtn.TextColor3=C2.WHITE; delBtn.TextSize=9; delBtn.Font=Enum.Font.GothamBold
                delBtn.ZIndex=604; delBtn.Parent=row; mkCorner(5,delBtn)

                local inserting=false
                copyBtn2.MouseButton1Click:Connect(function()
                    if inserting then return end; inserting=true
                    local assetId = tonumber(tostring(item.id):match("%d+"))
                    if not assetId then
                        nameLbl.Text="ID tidak valid!"; nameLbl.TextColor3=C2.RED
                        task.wait(1.5); nameLbl.Text=item.name; nameLbl.TextColor3=C2.TEXT; inserting=false; return
                    end
                    copyBtn2.Text="..."; copyBtn2.BackgroundColor3=C2.YELLOW

                    if activeCategory == "Sky" then
                        local ok = pcall(function()
                            local Lighting = game:GetService("Lighting")
                            local existing = Lighting:FindFirstChildOfClass("Sky")
                            if existing then existing:Destroy() end
                            local sky = Instance.new("Sky")
                            local faces = {"SkyboxBk","SkyboxDn","SkyboxFt","SkyboxLf","SkyboxRt","SkyboxUp"}
                            for _,f in ipairs(faces) do sky[f]="rbxassetid://"..tostring(assetId) end
                            sky.Parent = Lighting
                        end)
                        if ok then
                            nameLbl.Text="Sky Applied!"; nameLbl.TextColor3=C2.GREEN
                            copyBtn2.Text="âœ“"; copyBtn2.BackgroundColor3=C2.GREEN
                            task.spawn(function() showToast("âکپ Sky "..tostring(assetId).." diapply!", Color3.fromRGB(20,80,160)) end)
                        else
                            nameLbl.Text="Gagal apply!"; nameLbl.TextColor3=C2.RED
                            copyBtn2.Text="âœ—"; copyBtn2.BackgroundColor3=C2.RED
                            task.spawn(function() showToast("âœ— Gagal apply sky", Color3.fromRGB(130,20,20)) end)
                        end
                        task.wait(1.5); nameLbl.Text=item.name; nameLbl.TextColor3=C2.TEXT
                        copyBtn2.Text="Apply"; copyBtn2.BackgroundColor3=C2.BLUE; inserting=false; return
                    end

                    local MPS = game:GetService("MarketplaceService")
                    local aType2 = 0
                    pcall(function()
                        local inf2 = MPS:GetProductInfo(assetId, Enum.InfoType.Asset)
                        aType2 = inf2 and inf2.AssetTypeId or 0
                    end)
                    local BLOCKED_TYPES = {[21]=true, [9]=true, [3]=true}
                    if aType2 ~= 0 and BLOCKED_TYPES[aType2] then
                        nameLbl.Text="Tipe tidak support!"; nameLbl.TextColor3=C2.RED
                        copyBtn2.Text="âœ—"; copyBtn2.BackgroundColor3=C2.RED
                        task.spawn(function() showToast("âœ— Tipe asset tidak bisa diinsert (type "..aType2..")", Color3.fromRGB(130,20,20)) end)
                        task.wait(2); nameLbl.Text=item.name; nameLbl.TextColor3=C2.TEXT
                        copyBtn2.Text="Insert"; copyBtn2.BackgroundColor3=C2.BLUE; inserting=false; return
                    end

                    copyBtn2.Text="Memuat..."; copyBtn2.BackgroundColor3=C2.YELLOW

                    local spawnCF = CFrame.new(0, 5, 0)
                    local cam = workspace.CurrentCamera
                    if cam then
                        local cf  = cam.CFrame
                        local fwd = Vector3.new(cf.LookVector.X, 0, cf.LookVector.Z)
                        if fwd.Magnitude > 0.01 then fwd = fwd.Unit else fwd = Vector3.new(0,0,-1) end
                        local pos = cf.Position + fwd * 20
                        spawnCF = CFrame.new(pos.X, math.max(pos.Y, 3), pos.Z)
                    end

                    local function placeSavedObjs(objs)
                        local scriptCount = 0
                        local function countSc(obj)
                            if obj:IsA("LuaSourceContainer") then scriptCount = scriptCount + 1 end
                            for _, ch in ipairs(obj:GetChildren()) do countSc(ch) end
                        end
                        for _, obj in ipairs(objs) do
                            countSc(obj); obj.Parent = workspace
                            if obj:IsA("Model") then
                                if obj.PrimaryPart then obj:SetPrimaryPartCFrame(spawnCF)
                                else local firstPart = obj:FindFirstChildOfClass("BasePart"); if firstPart then firstPart.CFrame = spawnCF end end
                            elseif obj:IsA("BasePart") then obj.CFrame = spawnCF end
                        end
                        return {scripts=scriptCount, fetchOk=true}
                    end

                    local ok, result = false, nil
                    local ok_a, res_a = pcall(function()
                        local IS = game:GetService("InsertService")
                        local container = IS:LoadAsset(assetId)
                        if not container then error("nil") end
                        local r = placeSavedObjs(container:GetChildren())
                        container:Destroy(); return r
                    end)
                    if ok_a then ok, result = true, res_a
                    else
                        local ok_b, res_b = pcall(function()
                            local objs = game:GetObjects("rbxassetid://"..tostring(assetId))
                            if not objs or #objs == 0 then error("empty") end
                            return placeSavedObjs(objs)
                        end)
                        if ok_b then ok, result = true, res_b
                        else ok, result = false, res_b end
                    end

                    if ok and type(result)=="table" then
                        nameLbl.Text="Inserted!"; nameLbl.TextColor3=C2.GREEN
                        copyBtn2.Text="âœ“"; copyBtn2.BackgroundColor3=C2.GREEN
                        local info = result.scripts > 0 and (" ("..result.scripts.." script)") or ""
                        task.spawn(function() showToast("âœ“ Asset "..tostring(assetId).." inserted"..info, Color3.fromRGB(20,100,40)) end)
                    else
                        nameLbl.Text="Gagal insert!"; nameLbl.TextColor3=C2.RED
                        copyBtn2.Text="âœ—"; copyBtn2.BackgroundColor3=C2.RED
                        local errMsg = tostring(result):match(":%s*(.+)$") or tostring(result)
                        task.spawn(function() showToast("âœ— Gagal: "..errMsg:sub(1,40), Color3.fromRGB(130,20,20)) end)
                    end
                    task.wait(1.5); nameLbl.Text=item.name; nameLbl.TextColor3=C2.TEXT
                    copyBtn2.Text=(activeCategory=="Sky") and "Apply" or "Insert"
                    copyBtn2.BackgroundColor3=C2.BLUE; inserting=false
                end)
                row.MouseEnter:Connect(function() row.BackgroundColor3=C2.CARD2 end)
                row.MouseLeave:Connect(function() row.BackgroundColor3=C2.CARD end)
                delBtn.MouseButton1Click:Connect(function()
                    for j,v in ipairs(toolboxItems) do
                        if v.name==item.name and v.id==item.id and v.category==item.category then
                            if v.isDefault then markDeletedDefault(v.id) end
                            table.remove(toolboxItems,j); break
                        end
                    end
                    saveItems(); refreshList()
                end)
            end
        end

        local function updateCategoryUI(active)
            for cat,btn in pairs(categoryButtons) do
                btn.BackgroundColor3 = (cat==active) and C2.BLUE or C2.CARD2
                btn.TextColor3 = C2.TEXT
            end
        end

        local loaded=loadItems()
        for _, v in ipairs(DEFAULT_ITEMS) do
            if not isDeletedDefault(v.id) then
                table.insert(toolboxItems, {name=v.name, id=v.id, category=v.category, isDefault=true})
            end
        end
        for _,v in ipairs(loaded) do
            if v.category ~= "Script" then table.insert(toolboxItems, v) end
        end
        refreshList(); updateCategoryUI(activeCategory)

        for cat,btn in pairs(categoryButtons) do
            btn.MouseButton1Click:Connect(function()
                activeCategory=cat; updateCategoryUI(activeCategory); refreshList()
            end)
        end

        local tbBot = Instance.new("Frame")
        tbBot.Size=UDim2.new(1,-10,0,84); tbBot.Position=UDim2.new(0,5,1,-88)
        tbBot.BackgroundColor3=C2.SURFACE; tbBot.BorderSizePixel=0; tbBot.ZIndex=601; tbBot.Parent=savedArea
        mkCorner(8,tbBot); mkStroke(1,C2.BORDER,tbBot)

        local addNameBox = Instance.new("TextBox")
        addNameBox.Size=UDim2.new(1,-8,0,24); addNameBox.Position=UDim2.new(0,4,0,6)
        addNameBox.BackgroundColor3=C2.CARD; addNameBox.BorderSizePixel=0; addNameBox.Text=""
        addNameBox.PlaceholderText="Nama item..."; addNameBox.TextColor3=C2.TEXT
        addNameBox.PlaceholderColor3=C2.SUBTEXT; addNameBox.TextSize=11; addNameBox.Font=Enum.Font.Arial
        addNameBox.ClearTextOnFocus=false; addNameBox.ZIndex=602; addNameBox.Parent=tbBot; mkCorner(5,addNameBox)

        local addIdBox = Instance.new("TextBox")
        addIdBox.Size=UDim2.new(1,-8,0,24); addIdBox.Position=UDim2.new(0,4,0,34)
        addIdBox.BackgroundColor3=C2.CARD; addIdBox.BorderSizePixel=0; addIdBox.Text=""
        addIdBox.PlaceholderText="Asset ID (contoh: 123456789)..."; addIdBox.TextColor3=C2.TEXT
        addIdBox.PlaceholderColor3=C2.SUBTEXT; addIdBox.TextSize=11; addIdBox.Font=Enum.Font.Arial
        addIdBox.ClearTextOnFocus=false; addIdBox.ZIndex=602; addIdBox.Parent=tbBot; mkCorner(5,addIdBox)

        local addBtn = Instance.new("TextButton")
        addBtn.Size=UDim2.new(0.48,0,0,22); addBtn.Position=UDim2.new(0,4,1,-26)
        addBtn.BackgroundColor3=C2.BLUE; addBtn.BorderSizePixel=0; addBtn.Text="+ Tambah"
        addBtn.TextColor3=C2.WHITE; addBtn.TextSize=10; addBtn.Font=Enum.Font.GothamBold
        addBtn.ZIndex=602; addBtn.Parent=tbBot; mkCorner(5,addBtn)

        local saveBtn = Instance.new("TextButton")
        saveBtn.Size=UDim2.new(0.48,0,0,22); saveBtn.Position=UDim2.new(0.52,-4,1,-26)
        saveBtn.BackgroundColor3=C2.GREEN; saveBtn.BorderSizePixel=0; saveBtn.Text="Simpan"
        saveBtn.TextColor3=C2.WHITE; saveBtn.TextSize=10; saveBtn.Font=Enum.Font.GothamBold
        saveBtn.ZIndex=602; saveBtn.Parent=tbBot; mkCorner(5,saveBtn)

        addBtn.MouseButton1Click:Connect(function()
            local name=addNameBox.Text:match("^%s*(.-)%s*$")
            local id=addIdBox.Text:match("^%s*(.-)%s*$")
            if name=="" or id=="" then
                addBtn.Text="Isi nama & ID!"; addBtn.BackgroundColor3=C2.ORANGE
                task.wait(1.5); addBtn.Text="+ Tambah"; addBtn.BackgroundColor3=C2.BLUE; return
            end
            table.insert(toolboxItems,{name=name,id=id,category=activeCategory})
            addNameBox.Text=""; addIdBox.Text=""; saveItems(); refreshList()
            addBtn.Text="Ditambah!"; addBtn.BackgroundColor3=C2.GREEN
            task.wait(1.5); addBtn.Text="+ Tambah"; addBtn.BackgroundColor3=C2.BLUE
        end)
        saveBtn.MouseButton1Click:Connect(function()
            saveItems(); saveBtn.Text="Tersimpan!"; saveBtn.BackgroundColor3=Color3.fromRGB(20,120,60)
            task.wait(1.5); saveBtn.Text="Simpan"; saveBtn.BackgroundColor3=C2.GREEN
        end)
    end
    _toolbox()
    _G.SL_OpenToolbox = function()
        if openTbPanel and not tbPanelOpen then openTbPanel() end
    end
    _G.SL_CloseToolbox = function()
        if closeTbPanel and tbPanelOpen then closeTbPanel() end
    end
    _G.SL_ToggleToolbox = function()
        if tbPanelOpen then
            if closeTbPanel then closeTbPanel() end
        elseif openTbPanel then
            openTbPanel()
        end
    end
end

task.spawn(loadFirstToolbox)
