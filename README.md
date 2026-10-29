--[[
DZ HUP  |  Studio Tools  (Executor Edition)  =  3D Name Maker + Toolbox
Made by RiyadoDzz

v23: Diag button (Toolbox sidebar) compares native vs inserted Tune modules.
v22: Placing in front of the camera is back. Scripts are also registered in Studio Lite's own script table (searched at runtime).
v21: script code is restored from the file, with a decompile fallback.
v20: Models arrive complete. Toolbox options row removed, cleaner design.
v19: Toolbox inserts items untouched.

v18: Auto-removes blocked texture overlays, replaces blocked MeshParts with physics-safe blocks, and relocates a bundled A-Chassis Tune module when found; missing tune is safely anchored and reported.
v14: Toolbox now preloads meshes before placing, puts the lowest part on the ground, never deletes real car scripts, and puts back items that fall through the floor.

v13: items no longer fall in Play mode (Anchor defaults to Smart, old items get anchored); World moved inside Names;
bigger text and a cleaner Toolbox layout.

v12: FIX for Play mode errors. Scripts that come with a model (A-Chassis Tune, car scripts) now stay NEXT TO the model;
random-named / obfuscated scripts (free-model viruses) are removed on insert; sounds that cannot load are removed.

v11: SEPARATE SYSTEMS + new professional Toolbox.
- Each tool is its own module (H.registerModule) with its own tab, page and saved data.
  Names = Create / Style / Saved (one menu). Toolbox = its own menu. World, Creator = own menus.
- NO folders and no wrappers: names and toolbox items go straight into Workspace / the right service.
- Toolbox: scripts go where they belong (Script > ServerScriptService, LocalScript > StarterPlayerScripts,
  ModuleScript > ReplicatedStorage, ScreenGui > StarterGui, Tool > StarterPack, Sky > Lighting).
  Scripts inside a model stay inside it so cars and doors keep working.
- Everything inserted is remembered and comes back after Play mode / project switch.

v10: NEW REAL Toolbox (replaces the old fixed list). Same window, same RX icon, separate system.
- Pulls items live from the Roblox Creator Store, classified like the real store:
  Models / Decals / Meshes / Audio / Animations / Plugins + Favorites + My IDs.
- Search the whole store, sort (Relevance / Most used / Favorited / Newest / Top rated), Load more.
- Big thumbnail cards, bold names, creator, asset id, type tag, Insert / Add / Apply / Copy ID.
- Insert in front of your camera (sits on the ground), Undo, Clear, Anchor and Remove-scripts options.
- My IDs keeps your old 34 items and lets you add your own by asset id (a full link also works).
- The Toolbox has its own saved data (settings.toolboxV2), separate from the Name Maker.
- Interface font is now bold (GothamBold / GothamBlack) so everything is clear.

v9: Toolbox tab (old fixed list, replaced by v10).

v8.1: no more failed rbxassetid sound error; optional local sound file.
v8: click sound forced (downloaded once, played from a local file), World tab with
Day / Night, Sparkles are now an optional effect (off by default).

v7: float and dual color rebuilt ONLY from legacy body movers (BodyForce / BodyPosition /
BodyGyro), the same kind of object that already keeps your names in place after reopening.
Old v6 float pieces (welds, constraints) are removed automatically.

v6: effects that work with NO script (saved inside the project):
- Float = real physics (spring + slider constraint, saved in the name), bobs up and down in Play.
- Dual color / Rainbow = colored shimmer particles on every letter (also visible in edit mode).
- Old names are upgraded in place (your manual edits are kept).

v5: names are held in place WITHOUT any script (anchored + body movers),
colors are baked into the letters, saved names in the project are adopted (never deleted),
and the effects installer tries every method and reports why it failed.

v4: FULLY AUTOMATIC.
- The effects script (DZHUP_Effects) is installed / updated in ServerScriptService by this
  tool itself (it tries several methods). No manual paste is needed.
- The effects script also anchors every letter when the game starts, so names never fall.
- Effect data is saved inside each name (attributes), so everything survives save / reopen.
- No backslash is used anywhere (Studio Lite deletes them on paste).
]]
do -- BLOCK banner
local function u(...)
local out = {}
for _, code in ipairs({ ... }) do
out[#out + 1] = utf8.char(code)
end
return table.concat(out)
end
local pad = string.rep("_", 16)
print(pad .. u(0x2591, 0x2588, 0x2580, 0x2584, 0x2591, 0x2588, 0x2591, 0x2588, 0x2591, 0x2588, 0x2580, 0x2584, 0x2591, 0x2580, 0x2580, 0x2588) .. pad)
print(pad .. u(0x2591, 0x2588, 0x2580, 0x2584, 0x2591, 0x2584, 0x2580, 0x2584, 0x2591, 0x2588, 0x2591, 0x2588, 0x2591, 0x2584, 0x2580, 0x2591) .. pad)
print(pad .. u(0x2591, 0x2580, 0x2591, 0x2580, 0x2591, 0x2580, 0x2591, 0x2580, 0x2591, 0x2580, 0x2580, 0x2591, 0x2591, 0x2580, 0x2580, 0x2580) .. pad)
print(" ")
print(u(0x25C6) .. " RXDZ | STUDIO TOOLS")
print(u(0x25C6) .. " Name Maker " .. u(0x2022) .. " Toolbox")
end -- BLOCK banner
if not game:IsLoaded() then
game.Loaded:Wait()
end
local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local HttpService = game:GetService("HttpService")
local StarterGui = game:GetService("StarterGui")
local Workspace = game:GetService("Workspace")
local player = Players.LocalPlayer
local CONFIG = {
Creator = "RiyadoDzz",
Community = "DZ HUP",
Discord = "https://discord.gg/Dj3CCnZAxJ",
WhatsApp = "https://whatsapp.com/channel/0029VbDuGkhGJP8DJbzVEG0K",
TikTok = "https://tiktok.com/@rx..dz",
SupportPasses = {
{ amount = 50, id = 1940166338 },
{ amount = 100, id = 1933036013 },
},
RobloxUsername = "RiyadoDzz",
AvatarRobloxUserId = 0,
AvatarImageUrl = "",
DefaultFont = "Rockwell",
Fonts = {
{ key = "Rockwell", title = "Rockwell", packId = 4506165589, letterIds = {} },
{ key = "GothamBlack", title = "Gotham Black", packId = 15715862597, letterIds = {} },
{ key = "Horror", title = "Horror", packId = 3789128815, letterIds = {} },
},
SaveFile = "DZHUP_NameMaker.json",
PromptOnLaunch = true,
ClickSoundFile = "DZHUP_click.mp3",
TryAssetIdDirect = false, -- true = also try rbxassetid directly (prints an error in Studio Lite)
ClickSoundAssetId = 70968472837037, -- played from a downloaded local file, so it works without publishing
ClickSoundIds = {
"rbxasset://sounds/button.wav",
"rbxasset://sounds/switch.wav",
"rbxasset://sounds/clickfast.wav",
"rbxassetid://421058925",
"rbxassetid://6895079853",
},
ClickSoundVolume = 0.8,
ToggleKey = Enum.KeyCode.RightShift,
WaveSpeed = 0.35,
WaveSpread = 1,
MaxNameLength = 24,
MaxNames = 40,
LetterGap = 0.16,
SpaceWidthRatio = 0.6,
PlaceDistance = 18,
MaxPlaceDistance = 150,
StackRadius = 25,
HeightOffset = 2.8,
FrontFaceIsNegativeZ = true,
RestoreMaxDistance = 150,
ToolboxPlaceDistance = 22, -- how far in front of the camera items are inserted
}
local FONTS = CONFIG.Fonts
local FONT_BY_KEY = {}
for _, font in ipairs(FONTS) do
FONT_BY_KEY[font.key] = font
end
local function fontOf(key)
return FONT_BY_KEY[key] or FONT_BY_KEY[CONFIG.DefaultFont] or FONTS[1]
end
local genv = (type(getgenv) == "function" and getgenv()) or _G
if genv.DZHUP_NameMakerCleanup then
pcall(genv.DZHUP_NameMakerCleanup)
end
local conns = {}
local H = {} -- helper functions (kept in one table to save local variable slots)
local function on(signal, fn)
local c = signal:Connect(fn)
table.insert(conns, c)
return c
end
local hasFS = type(writefile) == "function" and type(readfile) == "function" and type(isfile) == "function"
local function copyText(text)
local fn = setclipboard or toclipboard or set_clipboard
if type(fn) == "function" then
local ok = pcall(fn, text)
return ok
end
return false
end
local function loadObject(id)
local ok, result = pcall(function()
return game:GetObjects("rbxassetid://" .. tostring(id))
end)
if ok and type(result) == "table" and result[1] then
return result[1]
end
return nil, tostring(result)
end
local save = { settings = {}, places = {} }
if hasFS and isfile(CONFIG.SaveFile) then
pcall(function()
local decoded = HttpService:JSONDecode(readfile(CONFIG.SaveFile))
if type(decoded) == "table" then
save.settings = type(decoded.settings) == "table" and decoded.settings or {}
save.places = type(decoded.places) == "table" and decoded.places or {}
end
end)
end
local function computeKey()
local id = game.PlaceId
if type(id) == "number" and id ~= 0 then
return tostring(id)
end
local ok, projectName = pcall(function()
return game.Name
end)
return "0|" .. tostring(ok and projectName or "project")
end
local placeKey = computeKey()
if type(save.places[placeKey]) ~= "table" then
if type(save.places["0"]) == "table" and string.sub(placeKey, 1, 2) == "0|" then
save.places[placeKey] = save.places["0"]
save.places["0"] = nil
else
save.places[placeKey] = {}
end
end
local names = save.places[placeKey]
local function persist()
if not hasFS then
return false
end
local ok = pcall(function()
writefile(CONFIG.SaveFile, HttpService:JSONEncode(save))
end)
return ok
end
local THEME = {
bg = Color3.fromRGB(14, 16, 23),
bgTop = Color3.fromRGB(24, 27, 38),
header = Color3.fromRGB(17, 19, 27),
surface = Color3.fromRGB(23, 26, 36),
surface2 = Color3.fromRGB(33, 37, 50),
field = Color3.fromRGB(13, 15, 21),
line = Color3.fromRGB(50, 56, 75),
text = Color3.fromRGB(238, 241, 248),
muted = Color3.fromRGB(140, 149, 172),
dark = Color3.fromRGB(22, 19, 12),
accent = Color3.fromRGB(240, 185, 80),
accentSoft = Color3.fromRGB(255, 218, 150),
danger = Color3.fromRGB(240, 98, 110),
success = Color3.fromRGB(96, 214, 150),
discord = Color3.fromRGB(88, 101, 242),
whatsapp = Color3.fromRGB(37, 211, 102),
tiktok = Color3.fromRGB(254, 44, 85),
}
local PALETTE = {
{ "White", Color3.fromRGB(245, 245, 245) },
{ "Gold", Color3.fromRGB(255, 211, 105) },
{ "Orange", Color3.fromRGB(255, 150, 60) },
{ "Red", Color3.fromRGB(255, 70, 75) },
{ "Pink", Color3.fromRGB(255, 105, 190) },
{ "Purple", Color3.fromRGB(170, 115, 255) },
{ "Blue", Color3.fromRGB(65, 150, 255) },
{ "Cyan", Color3.fromRGB(80, 230, 240) },
{ "Green", Color3.fromRGB(70, 225, 145) },
{ "Lime", Color3.fromRGB(190, 240, 70) },
{ "Silver", Color3.fromRGB(170, 176, 190) },
{ "Black", Color3.fromRGB(34, 34, 40) },
}
local STYLES = {
{ key = "Plastic", title = "Plastic" },
{ key = "Neon", title = "Neon" },
{ key = "Metal", title = "Metal" },
{ key = "Glass", title = "Glass" },
{ key = "Modern", title = "Modern" },
}
local STYLE_TITLES = {}
for _, item in ipairs(STYLES) do
STYLE_TITLES[item.key] = item.title
end
local STYLE_DEFS = {
Plastic = { material = Enum.Material.SmoothPlastic, reflectance = 0.03, transparency = 0 },
Neon = { material = Enum.Material.Neon, reflectance = 0, transparency = 0 },
Metal = { material = Enum.Material.Metal, reflectance = 0.12, transparency = 0 },
Glass = { material = Enum.Material.Glass, reflectance = 0.08, transparency = 0.12 },
Modern = { material = Enum.Material.SmoothPlastic, reflectance = 0.08, transparency = 0 },
}
local function new(className, props, parent)
local instance = Instance.new(className)
-- Global readability bump for every UI label/button built through this helper.
if (className == "TextLabel" or className == "TextButton" or className == "TextBox") and type(props.TextSize) == "number" then
props.TextSize = math.floor(props.TextSize * 1.18 + 0.5)
end
for key, value in pairs(props) do
instance[key] = value
end
instance.Parent = parent
return instance
end
local function corner(parent, radius)
return new("UICorner", { CornerRadius = UDim.new(0, radius) }, parent)
end
local function stroke(parent, color, transparency, thickness)
return new("UIStroke", {
Color = color,
Transparency = transparency,
Thickness = thickness or 1,
ApplyStrokeMode = Enum.ApplyStrokeMode.Border,
}, parent)
end
local function tween(instance, duration, goal, style, direction, delay)
local t = TweenService:Create(
instance,
TweenInfo.new(
duration,
style or Enum.EasingStyle.Quad,
direction or Enum.EasingDirection.Out,
0,
false,
delay or 0
),
goal
)
t:Play()
return t
end
local function loop(instance, duration, goal, style, reverses)
local t = TweenService:Create(
instance,
TweenInfo.new(duration, style or Enum.EasingStyle.Sine, Enum.EasingDirection.InOut, -1, reverses ~= false),
goal
)
t:Play()
return t
end
local function textLabel(parent, text, props)
props.BackgroundTransparency = 1
props.Text = text
props.Font = props.Font or Enum.Font.GothamBold
props.TextColor3 = props.TextColor3 or THEME.text
props.TextSize = props.TextSize or 14
props.TextXAlignment = props.TextXAlignment or Enum.TextXAlignment.Left
return new("TextLabel", props, parent)
end
local function makeButton(parent, props, options)
options = options or {}
local fill = options.fill or THEME.surface2
local hoverFill = options.hover or fill:Lerp(Color3.new(1, 1, 1), 0.08)
local pressFill = fill:Lerp(Color3.new(0, 0, 0), 0.25)
props.BackgroundColor3 = fill
props.AutoButtonColor = false
props.BorderSizePixel = 0
props.Font = props.Font or Enum.Font.GothamBold
props.TextColor3 = props.TextColor3 or THEME.text
props.TextSize = props.TextSize or 14
local button = new("TextButton", props, parent)
corner(button, options.radius or 9)
local buttonStroke = stroke(button, options.stroke or THEME.line, options.strokeTransparency or 0.3, 1)
local hovering = false
button.MouseEnter:Connect(function()
hovering = true
tween(button, 0.12, { BackgroundColor3 = hoverFill })
end)
button.MouseLeave:Connect(function()
hovering = false
tween(button, 0.12, { BackgroundColor3 = fill })
end)
button.MouseButton1Down:Connect(function()
tween(button, 0.06, { BackgroundColor3 = pressFill })
end)
button.MouseButton1Up:Connect(function()
tween(button, 0.1, { BackgroundColor3 = hovering and hoverFill or fill })
end)
return button, buttonStroke
end
local function trim(text)
return (string.gsub(string.gsub(text, "^%s+", ""), "%s+$", ""))
end
function H.migrateFolder(folderName)
pcall(function()
local ws = game:GetService("Workspace")
local old = ws:FindFirstChild(folderName)
if old and old:IsA("Folder") then
for _, child in ipairs(old:GetChildren()) do
child.Parent = ws
end
old:Destroy()
end
end)
end
function H.getFolder()
Workspace = game:GetService("Workspace")
H.migrateFolder("DZHUP_Names")
return Workspace
end
function H.sentinel()
local s = { inst = nil }
function s.reset()
pcall(function()
if s.inst then
s.inst:Destroy()
end
end)
pcall(function()
local ws = game:GetService("Workspace")
local inst = Instance.new("BoolValue")
inst.Name = "DZ"
inst.Archivable = false
inst.Parent = ws:FindFirstChildOfClass("Terrain") or ws
s.inst = inst
end)
end
function s.dead()
local ok, result = pcall(function()
return s.inst ~= nil and s.inst:IsDescendantOf(game)
end)
return not (ok and result == true)
end
s.reset()
return s
end
H.nameSentinel = H.sentinel()
local guiParent
do
local ok, hui = pcall(function()
return type(gethui) == "function" and gethui() or nil
end)
guiParent = (ok and hui) or player:WaitForChild("PlayerGui")
end
pcall(function()
for _, child in ipairs(guiParent:GetChildren()) do
if child.Name == "DZHUP_NameMaker" then
child:Destroy()
end
end
end)
local PANEL_W, PANEL_H = 620, 546
local MIN_SCALE = 0.4
local gui = new("ScreenGui", {
Name = "DZHUP_NameMaker",
ResetOnSpawn = false,
IgnoreGuiInset = true,
DisplayOrder = 999,
ZIndexBehavior = Enum.ZIndexBehavior.Sibling,
}, guiParent)
local SoundService = game:GetService("SoundService")
local ContentProvider = game:GetService("ContentProvider")
pcall(function()
for _, old in ipairs(SoundService:GetChildren()) do
if old.Name == "DZHUP_ClickSound" then
old:Destroy()
end
end
end)
local clickSound = new("Sound", {
Name = "DZHUP_ClickSound",
SoundId = CONFIG.ClickSoundIds[1],
Volume = CONFIG.ClickSoundVolume,
}, SoundService)
task.spawn(function()
local candidates = {}
local assetId = CONFIG.ClickSoundAssetId
local localAsset = nil
if hasFS and type(getcustomasset) == "function" and CONFIG.ClickSoundFile then
local found = false
pcall(function()
found = isfile(CONFIG.ClickSoundFile)
end)
if found then
local ok, asset = pcall(getcustomasset, CONFIG.ClickSoundFile)
if ok and asset then
localAsset = asset
table.insert(candidates, asset)
end
end
end
if assetId and hasFS and type(getcustomasset) == "function" then
local fileName = "DZHUP_click_" .. tostring(assetId) .. ".mp3"
local have = false
pcall(function()
have = isfile(fileName) and #readfile(fileName) > 1000
end)
if not have then
local function download(url)
local ok, body = pcall(function()
return game:HttpGet(url)
end)
if ok and type(body) == "string" and #body > 1000 and string.sub(body, 1, 7) ~= "<roblox" then
return body
end
for _, key in ipairs({ "request", "http_request" }) do
local fn = genv[key] or _G[key]
if type(fn) == "function" then
local ok2, response = pcall(fn, { Url = url, Method = "GET" })
local data = ok2 and type(response) == "table" and response.Body
if type(data) == "string" and #data > 1000 and string.sub(data, 1, 7) ~= "<roblox" then
return data
end
end
end
if type(genv.syn) == "table" and type(genv.syn.request) == "function" then
local ok3, response = pcall(genv.syn.request, { Url = url, Method = "GET" })
local data = ok3 and type(response) == "table" and response.Body
if type(data) == "string" and #data > 1000 and string.sub(data, 1, 7) ~= "<roblox" then
return data
end
end
return nil
end
local body = download("https://assetdelivery.roblox.com/v1/asset/?id=" .. tostring(assetId))
or download("https://assetdelivery.roblox.com/v1/asset?id=" .. tostring(assetId))
if body then
pcall(function()
writefile(fileName, body)
have = true
end)
end
end
if have then
local ok, asset = pcall(getcustomasset, fileName)
if ok and asset then
localAsset = asset
table.insert(candidates, asset)
end
end
end
if assetId and CONFIG.TryAssetIdDirect then
table.insert(candidates, "rbxassetid://" .. tostring(assetId))
end
for _, id in ipairs(CONFIG.ClickSoundIds) do
table.insert(candidates, id)
end
for _, id in ipairs(candidates) do
local test = Instance.new("Sound")
test.SoundId = id
test.Volume = 0
test.Parent = SoundService
pcall(function()
ContentProvider:PreloadAsync({ test })
end)
local waited = 0
while not test.IsLoaded and waited < 2 do
task.wait(0.1)
waited += 0.1
end
local works = test.IsLoaded and test.TimeLength > 0
test:Destroy()
if works then
clickSound.SoundId = id
return
end
end
if localAsset then
clickSound.SoundId = localAsset
end
end)
local function playClick()
pcall(function()
clickSound.TimePosition = 0
clickSound:Play()
end)
end
local function hookClick(instance)
if instance:IsA("TextButton") and instance.Name ~= "ResizeHandle" then
instance.Activated:Connect(playClick)
end
end
gui.DescendantAdded:Connect(hookClick)
local backdrop = new("Frame", {
Name = "Backdrop",
Size = UDim2.fromScale(1, 1),
BackgroundColor3 = Color3.new(0, 0, 0),
BackgroundTransparency = 1,
BorderSizePixel = 0,
Visible = false,
}, gui)
local openButton, openStroke = makeButton(gui, {
Text = "RX",
AnchorPoint = Vector2.new(0, 0.5),
Position = UDim2.new(0, 12, 0.5, 0),
Size = UDim2.fromOffset(44, 44),
TextSize = 16,
Font = Enum.Font.GothamBlack,
}, { fill = THEME.header, stroke = THEME.accent, strokeTransparency = 0.6, radius = 22 })
openButton.TextColor3 = THEME.accent
openButton.BackgroundTransparency = 0.5
openButton.TextTransparency = 0.1
local openButtonScale = new("UIScale", { Scale = 1 }, openButton)
local holder = new("Frame", {
Name = "Holder",
Position = UDim2.fromOffset(0, 0),
Size = UDim2.fromOffset(PANEL_W, PANEL_H),
BackgroundTransparency = 1,
Visible = false,
}, gui)
local scaler = new("UIScale", { Scale = 1 }, holder)
local panel = new("Frame", {
Name = "Panel",
AnchorPoint = Vector2.new(0.5, 0.5),
Position = UDim2.fromScale(0.5, 0.5),
Size = UDim2.fromScale(1, 1),
BackgroundColor3 = THEME.bg,
BorderSizePixel = 0,
ClipsDescendants = true,
}, holder)
corner(panel, 16)
local panelStroke = stroke(panel, THEME.line, 0.2, 1.2)
local popScale = new("UIScale", { Scale = 0.9 }, panel)
do -- BLOCK fillFrame
local fillFrame = new("Frame", {
Size = UDim2.fromScale(1, 1),
BackgroundColor3 = Color3.new(1, 1, 1),
BorderSizePixel = 0,
}, panel)
corner(fillFrame, 16)
new("UIGradient", { Color = ColorSequence.new(THEME.bgTop, THEME.bg), Rotation = 90 }, fillFrame)
end -- BLOCK fillFrame
local placed = false
local function maxScaleFor(x, y)
local v = gui.AbsoluteSize
return math.max(MIN_SCALE, math.min((v.X - x) / PANEL_W, (v.Y - y) / PANEL_H, 1.8))
end
local function defaultScale()
local v = gui.AbsoluteSize
return math.clamp(math.min(v.X * 0.94 / PANEL_W, v.Y * 0.9 / PANEL_H), MIN_SCALE, 1.25)
end
local function clampHolder()
local v = gui.AbsoluteSize
local w, h = PANEL_W * scaler.Scale, PANEL_H * scaler.Scale
local x = math.clamp(holder.Position.X.Offset, 0, math.max(0, v.X - w))
local y = math.clamp(holder.Position.Y.Offset, 0, math.max(0, v.Y - h))
holder.Position = UDim2.fromOffset(x, y)
end
local function placeInitially()
local v = gui.AbsoluteSize
scaler.Scale = defaultScale()
local w, h = PANEL_W * scaler.Scale, PANEL_H * scaler.Scale
holder.Position = UDim2.fromOffset(math.max(0, (v.X - w) / 2), math.max(0, (v.Y - h) / 2))
placed = true
end
gui:GetPropertyChangedSignal("AbsoluteSize"):Connect(function()
if not placed then
return
end
scaler.Scale = math.min(scaler.Scale, maxScaleFor(0, 0))
clampHolder()
end)
local header = new("Frame", {
Name = "Header",
Size = UDim2.new(1, 0, 0, 56),
BackgroundColor3 = THEME.header,
BorderSizePixel = 0,
Active = true,
}, panel)
corner(header, 16)
new("Frame", {
Position = UDim2.fromOffset(0, 40),
Size = UDim2.new(1, 0, 0, 16),
BackgroundColor3 = THEME.header,
BorderSizePixel = 0,
}, header)
do -- BLOCK badge
local badge = new("Frame", {
Position = UDim2.fromOffset(16, 12),
Size = UDim2.fromOffset(32, 32),
BackgroundColor3 = Color3.new(1, 1, 1),
BorderSizePixel = 0,
}, header)
corner(badge, 9)
new("UIGradient", { Color = ColorSequence.new(THEME.accentSoft, THEME.accent), Rotation = 60 }, badge)
textLabel(badge, "3D", {
Size = UDim2.fromScale(1, 1),
Font = Enum.Font.GothamBlack,
TextSize = 16,
TextColor3 = THEME.dark,
TextXAlignment = Enum.TextXAlignment.Center,
})
end -- BLOCK badge
textLabel(header, "DZ HUP  Studio Tools", {
Position = UDim2.fromOffset(58, 10),
Size = UDim2.new(1, -260, 0, 20),
Font = Enum.Font.GothamBlack,
TextSize = 17,
})
textLabel(header, "Name Maker (with World)  |  Toolbox", {
Position = UDim2.fromOffset(58, 31),
Size = UDim2.new(1, -260, 0, 16),
TextSize = 14,
TextColor3 = THEME.muted,
})
do -- BLOCK logo
local logoHolder = new("Frame", {
AnchorPoint = Vector2.new(1, 0.5),
Position = UDim2.new(1, -60, 0.5, 0),
Size = UDim2.fromOffset(70, 28),
BackgroundTransparency = 1,
}, header)
local logoPill = new("Frame", {
Size = UDim2.fromScale(1, 1),
BackgroundColor3 = THEME.surface,
BorderSizePixel = 0,
}, logoHolder)
corner(logoPill, 14)
stroke(logoPill, THEME.accent, 0.1, 1.5)
local logoText = textLabel(logoPill, "RXDZ", {
Size = UDim2.fromScale(1, 1),
Font = Enum.Font.GothamBlack,
TextSize = 15,
TextColor3 = Color3.new(1, 1, 1),
TextXAlignment = Enum.TextXAlignment.Center,
})
local logoGradient = new("UIGradient", {
Color = ColorSequence.new({
ColorSequenceKeypoint.new(0, THEME.accent),
ColorSequenceKeypoint.new(0.5, Color3.new(1, 1, 1)),
ColorSequenceKeypoint.new(1, THEME.accent),
}),
Offset = Vector2.new(-1, 0),
}, logoText)
loop(logoGradient, 2, { Offset = Vector2.new(1, 0) }, Enum.EasingStyle.Linear, false)
end -- BLOCK logo
local closeButton = makeButton(header, {
Text = "X",
AnchorPoint = Vector2.new(1, 0.5),
Position = UDim2.new(1, -14, 0.5, 0),
Size = UDim2.fromOffset(32, 32),
TextSize = 15,
Font = Enum.Font.GothamBlack,
TextColor3 = THEME.muted,
}, { fill = THEME.surface, stroke = THEME.line, strokeTransparency = 0.3, radius = 9, hover = THEME.danger })
closeButton.MouseEnter:Connect(function()
tween(closeButton, 0.12, { TextColor3 = THEME.text })
end)
closeButton.MouseLeave:Connect(function()
tween(closeButton, 0.12, { TextColor3 = THEME.muted })
end)
local sweep = new("Frame", {
AnchorPoint = Vector2.new(0.5, 0),
Position = UDim2.new(0.5, 0, 0, 56),
Size = UDim2.new(1, 0, 0, 1),
BackgroundColor3 = THEME.accent,
BackgroundTransparency = 0.6,
BorderSizePixel = 0,
ZIndex = 5,
}, panel)
new("UIGradient", {
Transparency = NumberSequence.new({
NumberSequenceKeypoint.new(0, 1),
NumberSequenceKeypoint.new(0.5, 0),
NumberSequenceKeypoint.new(1, 1),
}),
}, sweep)
local TAB_Y, CONTENT_Y = 70, 120
local tabTrack = new("Frame", {
Position = UDim2.fromOffset(16, TAB_Y),
Size = UDim2.fromOffset(588, 38),
BackgroundColor3 = THEME.field,
BorderSizePixel = 0,
ClipsDescendants = true,
}, panel)
corner(tabTrack, 10)
stroke(tabTrack, THEME.line, 0.5, 1)
local tabScroll = new("ScrollingFrame", {
Size = UDim2.fromScale(1, 1),
BackgroundTransparency = 1,
BorderSizePixel = 0,
ScrollBarThickness = 0,
CanvasSize = UDim2.new(),
ScrollingDirection = Enum.ScrollingDirection.X,
}, tabTrack)
local tabIndicator = new("Frame", {
Position = UDim2.fromOffset(4, 4),
Size = UDim2.fromOffset(84, 30),
BackgroundColor3 = Color3.new(1, 1, 1),
BorderSizePixel = 0,
}, tabScroll)
corner(tabIndicator, 7)
new("UIGradient", { Color = ColorSequence.new(THEME.accentSoft, THEME.accent), Rotation = 90 }, tabIndicator)
local content = new("Frame", {
Position = UDim2.fromOffset(16, CONTENT_Y),
Size = UDim2.fromOffset(588, 392),
BackgroundTransparency = 1,
}, panel)
local function newPage()
return new("Frame", { Size = UDim2.fromScale(1, 1), BackgroundTransparency = 1, Visible = false }, content)
end
local createPage = newPage()
local studioPage = newPage()
local listPage = newPage()
local aboutPage = newPage()
local worldPage = newPage()
H.modules = {}
function H.registerModule(def)
def.page = def.page or newPage()
table.insert(H.modules, def)
return def.page
end
textLabel(panel, "Drag the bottom-right corner to resize", {
AnchorPoint = Vector2.new(0.5, 1),
Position = UDim2.new(0.5, 0, 1, -10),
Size = UDim2.fromOffset(400, 14),
TextSize = 13,
TextColor3 = THEME.muted,
TextXAlignment = Enum.TextXAlignment.Center,
})
local toast = new("Frame", {
AnchorPoint = Vector2.new(0.5, 1),
Position = UDim2.new(0.5, 0, 1, 24),
AutomaticSize = Enum.AutomaticSize.XY,
BackgroundColor3 = THEME.header,
BackgroundTransparency = 1,
BorderSizePixel = 0,
ZIndex = 30,
Visible = false,
}, panel)
corner(toast, 10)
local toastStroke = stroke(toast, THEME.line, 1, 1)
new("UIPadding", {
PaddingTop = UDim.new(0, 8),
PaddingBottom = UDim.new(0, 8),
PaddingLeft = UDim.new(0, 16),
PaddingRight = UDim.new(0, 16),
}, toast)
local toastLabel = textLabel(toast, "", {
AutomaticSize = Enum.AutomaticSize.XY,
Size = UDim2.new(),
Font = Enum.Font.GothamBold,
TextSize = 15,
TextTransparency = 1,
ZIndex = 31,
TextXAlignment = Enum.TextXAlignment.Center,
})
local toastToken = 0
local function showToast(message, good)
toastToken += 1
local token = toastToken
local color = good and THEME.success or THEME.danger
toastLabel.Text = message
toastLabel.TextColor3 = color
toastStroke.Color = color
toast.Visible = true
toast.Position = UDim2.new(0.5, 0, 1, 24)
tween(toast, 0.3, { Position = UDim2.new(0.5, 0, 1, -30), BackgroundTransparency = 0.05 }, Enum.EasingStyle.Quint)
tween(toastLabel, 0.2, { TextTransparency = 0 })
tween(toastStroke, 0.2, { Transparency = 0.35 })
task.delay(3.2, function()
if token ~= toastToken then
return
end
tween(toast, 0.22, { Position = UDim2.new(0.5, 0, 1, 24), BackgroundTransparency = 1 })
tween(toastLabel, 0.2, { TextTransparency = 1 })
tween(toastStroke, 0.2, { Transparency = 1 })
task.delay(0.25, function()
if token == toastToken then
toast.Visible = false
end
end)
end)
end
local form = new("Frame", {
Size = UDim2.fromOffset(350, 356),
BackgroundColor3 = THEME.surface,
BorderSizePixel = 0,
}, createPage)
corner(form, 12)
stroke(form, THEME.line, 0.5, 1)
local function sectionTitle(parent, text, y)
return textLabel(parent, text, {
Position = UDim2.fromOffset(16, y),
Size = UDim2.new(1, -32, 0, 16),
Font = Enum.Font.GothamBold,
TextSize = 15,
TextColor3 = THEME.muted,
})
end
sectionTitle(form, "NAME", 12)
local counter = textLabel(form, "0/" .. CONFIG.MaxNameLength, {
Position = UDim2.fromOffset(16, 12),
Size = UDim2.new(1, -32, 0, 16),
TextSize = 14,
TextColor3 = THEME.muted,
TextXAlignment = Enum.TextXAlignment.Right,
})
local nameBox = new("TextBox", {
Position = UDim2.fromOffset(16, 32),
Size = UDim2.fromOffset(318, 42),
BackgroundColor3 = THEME.field,
BorderSizePixel = 0,
ClearTextOnFocus = false,
PlaceholderText = "Type your name...",
PlaceholderColor3 = THEME.muted,
Text = "",
TextColor3 = THEME.text,
TextSize = 19,
Font = Enum.Font.GothamBold,
TextXAlignment = Enum.TextXAlignment.Center,
}, form)
corner(nameBox, 10)
local nameStroke = stroke(nameBox, THEME.line, 0.35, 1)
nameBox.Focused:Connect(function()
tween(nameStroke, 0.18, { Color = THEME.accent, Transparency = 0 })
end)
nameBox.FocusLost:Connect(function()
tween(nameStroke, 0.18, { Color = THEME.line, Transparency = 0.35 })
end)
sectionTitle(form, "LETTER COLOR", 88)
local swatchGrid = new("Frame", {
Position = UDim2.fromOffset(16, 108),
Size = UDim2.fromOffset(318, 59),
BackgroundTransparency = 1,
}, form)
new("UIGridLayout", {
CellSize = UDim2.fromOffset(44, 26),
CellPadding = UDim2.fromOffset(10, 7),
HorizontalAlignment = Enum.HorizontalAlignment.Center,
SortOrder = Enum.SortOrder.LayoutOrder,
}, swatchGrid)
sectionTitle(form, "MATERIAL", 178)
local styleRow = new("Frame", {
Position = UDim2.fromOffset(16, 198),
Size = UDim2.fromOffset(318, 30),
BackgroundTransparency = 1,
}, form)
new("UIGridLayout", {
CellSize = UDim2.fromOffset(58, 30),
CellPadding = UDim2.fromOffset(7, 0),
HorizontalAlignment = Enum.HorizontalAlignment.Center,
SortOrder = Enum.SortOrder.LayoutOrder,
}, styleRow)
sectionTitle(form, "FONT", 240)
local fontRow = new("ScrollingFrame", {
Position = UDim2.fromOffset(16, 260),
Size = UDim2.fromOffset(318, 30),
BackgroundTransparency = 1,
BorderSizePixel = 0,
ScrollBarThickness = 0,
CanvasSize = UDim2.new(),
AutomaticCanvasSize = Enum.AutomaticSize.X,
ScrollingDirection = Enum.ScrollingDirection.X,
}, form)
new("UIListLayout", {
FillDirection = Enum.FillDirection.Horizontal,
Padding = UDim.new(0, 7),
SortOrder = Enum.SortOrder.LayoutOrder,
}, fontRow)
local createButton = makeButton(form, {
Text = "CREATE 3D NAME",
Position = UDim2.fromOffset(16, 302),
Size = UDim2.fromOffset(318, 46),
TextSize = 16,
Font = Enum.Font.GothamBlack,
TextColor3 = THEME.dark,
}, { fill = THEME.accent, hover = THEME.accentSoft, stroke = THEME.accentSoft, strokeTransparency = 0.5, radius = 11 })
local previewCard = new("Frame", {
Position = UDim2.fromOffset(362, 0),
Size = UDim2.fromOffset(226, 356),
BackgroundColor3 = THEME.surface,
BorderSizePixel = 0,
}, createPage)
corner(previewCard, 12)
stroke(previewCard, THEME.line, 0.5, 1)
textLabel(previewCard, "PREVIEW", {
Position = UDim2.fromOffset(14, 12),
Size = UDim2.new(1, -28, 0, 16),
Font = Enum.Font.GothamBold,
TextSize = 15,
TextColor3 = THEME.muted,
})
local stage = new("Frame", {
Position = UDim2.fromOffset(12, 34),
Size = UDim2.fromOffset(202, 190),
BackgroundColor3 = Color3.new(1, 1, 1),
BorderSizePixel = 0,
ClipsDescendants = true,
}, previewCard)
corner(stage, 10)
new("UIGradient", {
Color = ColorSequence.new({
ColorSequenceKeypoint.new(0, Color3.fromRGB(40, 45, 62)),
ColorSequenceKeypoint.new(1, Color3.fromRGB(16, 18, 26)),
}),
Rotation = 90,
}, stage)
stroke(stage, THEME.line, 0.55, 1)
new("Frame", {
AnchorPoint = Vector2.new(0.5, 1),
Position = UDim2.new(0.5, 0, 1, -26),
Size = UDim2.new(0.76, 0, 0, 1),
BackgroundColor3 = THEME.line,
BackgroundTransparency = 0.3,
BorderSizePixel = 0,
}, stage)
local previewText = textLabel(stage, "YOUR NAME", {
AnchorPoint = Vector2.new(0.5, 0.5),
Position = UDim2.new(0.5, 0, 0.5, -10),
Size = UDim2.new(1, -24, 1, -64),
Font = Enum.Font.GothamBlack,
TextScaled = true,
TextWrapped = true,
TextXAlignment = Enum.TextXAlignment.Center,
})
new("UITextSizeConstraint", { MaxTextSize = 44, MinTextSize = 10 }, previewText)
local previewStroke = new("UIStroke", {
Thickness = 1.5,
Color = Color3.fromRGB(8, 8, 12),
Transparency = 0.2,
ApplyStrokeMode = Enum.ApplyStrokeMode.Contextual,
}, previewText)
local previewGradient = new("UIGradient", {
Color = ColorSequence.new({
ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 255, 255)),
ColorSequenceKeypoint.new(0.5, Color3.fromRGB(150, 150, 150)),
ColorSequenceKeypoint.new(1, Color3.fromRGB(255, 255, 255)),
}),
Rotation = 90,
Enabled = false,
}, previewText)
local previewDual = new("UIGradient", {
Color = ColorSequence.new(Color3.new(1, 1, 1)),
Offset = Vector2.new(-1, 0),
Enabled = false,
}, previewText)
loop(previewDual, 2.2, { Offset = Vector2.new(1, 0) }, Enum.EasingStyle.Linear, false)
local infoStyle = textLabel(previewCard, "", {
Position = UDim2.fromOffset(14, 238),
Size = UDim2.new(1, -28, 0, 18),
TextSize = 15,
})
local infoColor = textLabel(previewCard, "", {
Position = UDim2.fromOffset(14, 262),
Size = UDim2.new(1, -28, 0, 18),
TextSize = 15,
})
local infoFont = textLabel(previewCard, "", {
Position = UDim2.fromOffset(14, 286),
Size = UDim2.new(1, -28, 0, 18),
TextSize = 15,
})
local infoDot = new("Frame", {
AnchorPoint = Vector2.new(1, 0),
Position = UDim2.new(1, -14, 0, 265),
Size = UDim2.fromOffset(12, 12),
BackgroundColor3 = Color3.new(1, 1, 1),
BorderSizePixel = 0,
}, previewCard)
corner(infoDot, 6)
stroke(infoDot, THEME.text, 0.6, 1)
local selectedColorIndex = 1
local selectedColor2Index = 6
local dualOn = false
local activeSlot = 1
local refreshDual = nil
local selectedStyle = "Plastic"
local selectedFont = fontOf(CONFIG.DefaultFont)
local swatches = {}
local SIZES = {
{ key = "S", title = "Small" },
{ key = "M", title = "Medium" },
{ key = "L", title = "Large" },
{ key = "XL", title = "Huge" },
}
local SIZE_VALUES = { S = 0.6, M = 1, L = 1.6, XL = 2.4 }
local SPACINGS = {
{ key = "T", title = "Tight" },
{ key = "N", title = "Normal" },
{ key = "W", title = "Wide" },
}
local SPACING_VALUES = { T = 0.25, N = 1, W = 2.6 }
local SHAPES = {
{ key = "Straight", title = "Straight" },
{ key = "ArcUp", title = "Arc Up" },
{ key = "ArcDown", title = "Arc Down" },
{ key = "Wave", title = "Wave" },
}
local SHAPE_TITLES = { Straight = "Straight", ArcUp = "Arc Up", ArcDown = "Arc Down", Wave = "Wave" }
local CASES = {
{ key = "Normal", title = "As typed" },
{ key = "Upper", title = "UPPER" },
{ key = "Lower", title = "lower" },
{ key = "Title", title = "Title Case" },
}
local EFFECTS = {
{ key = "glow", title = "Glow" },
{ key = "float", title = "Float" },
{ key = "rainbow", title = "Rainbow" },
{ key = "sparkles", title = "Sparkles" },
}
local FX_TITLES = { glow = "Glow", float = "Float", rainbow = "Rainbow", sparkles = "Sparkles" }
local studio = {
size = "M",
gap = "N",
shape = "Straight",
case = "Normal",
fx = { glow = false, float = false, rainbow = false, sparkles = false },
}
local function applyCase(text)
if studio.case == "Upper" then
return string.upper(text)
elseif studio.case == "Lower" then
return string.lower(text)
elseif studio.case == "Title" then
return (string.gsub(string.lower(text), "(%a)([%w']*)", function(first, rest)
return string.upper(first) .. rest
end))
end
return text
end
local function currentFx()
local result, any = {}, false
for key, value in pairs(studio.fx) do
if value then
result[key] = true
any = true
end
end
return any and result or nil
end
local function selectedColor2()
return PALETTE[selectedColor2Index][2]
end
local function selectedColor()
return PALETTE[selectedColorIndex][2]
end
local function updatePreview()
local color = selectedColor()
local text = nameBox.Text ~= "" and applyCase(nameBox.Text) or "YOUR NAME"
previewText.Text = text
previewText.TextColor3 = color
previewText.TextTransparency = 0
previewGradient.Enabled = false
previewStroke.Color = Color3.fromRGB(8, 8, 12)
previewStroke.Thickness = 1.5
previewStroke.Transparency = 0.2
if selectedStyle == "Neon" then
previewStroke.Color = color
previewStroke.Thickness = 3
previewStroke.Transparency = 0.55
elseif selectedStyle == "Metal" then
previewGradient.Enabled = true
elseif selectedStyle == "Glass" then
previewText.TextTransparency = 0.3
previewStroke.Color = Color3.new(1, 1, 1)
previewStroke.Transparency = 0.5
elseif selectedStyle == "Modern" then
previewText.TextTransparency = 0.88
previewStroke.Color = color
previewStroke.Thickness = 2
previewStroke.Transparency = 0.05
end
if dualOn then
local c2 = selectedColor2()
previewText.TextColor3 = Color3.new(1, 1, 1)
previewGradient.Enabled = false
previewDual.Color = ColorSequence.new({
ColorSequenceKeypoint.new(0, color),
ColorSequenceKeypoint.new(0.5, c2),
ColorSequenceKeypoint.new(1, color),
})
previewDual.Enabled = true
else
previewDual.Enabled = false
end
infoStyle.Text = "Material: " .. (STYLE_TITLES[selectedStyle] or selectedStyle)
if dualOn then
infoColor.Text = "Color: " .. PALETTE[selectedColorIndex][1] .. " + " .. PALETTE[selectedColor2Index][1]
else
infoColor.Text = "Color: " .. PALETTE[selectedColorIndex][1]
end
if refreshDual then
refreshDual()
end
infoFont.Text = "Font: " .. selectedFont.title
infoDot.BackgroundColor3 = color
end
for index, item in ipairs(PALETTE) do
local swatch = new("TextButton", {
BackgroundColor3 = item[2],
AutoButtonColor = false,
BorderSizePixel = 0,
Text = "",
LayoutOrder = index,
}, swatchGrid)
corner(swatch, 8)
local ring = stroke(swatch, THEME.accentSoft, 1, 2)
swatches[index] = ring
local function isChosen()
return selectedColorIndex == index or (dualOn and selectedColor2Index == index)
end
swatch.MouseEnter:Connect(function()
if not isChosen() then
tween(ring, 0.1, { Transparency = 0.6 })
end
end)
swatch.MouseLeave:Connect(function()
if not isChosen() then
tween(ring, 0.1, { Transparency = 1 })
end
end)
swatch.Activated:Connect(function()
if dualOn and activeSlot == 2 then
selectedColor2Index = index
else
selectedColorIndex = index
end
updatePreview()
end)
end
local dualButton = new("TextButton", {
Text = "DUAL",
AnchorPoint = Vector2.new(1, 0),
Position = UDim2.new(1, -16, 0, 84),
Size = UDim2.fromOffset(56, 20),
TextSize = 13,
Font = Enum.Font.GothamBold,
TextColor3 = THEME.text,
BackgroundColor3 = THEME.surface2,
AutoButtonColor = false,
BorderSizePixel = 0,
}, form)
corner(dualButton, 6)
stroke(dualButton, THEME.line, 0.4, 1)
local slotButtons = {}
for slot = 1, 2 do
local button = new("TextButton", {
Text = tostring(slot),
AnchorPoint = Vector2.new(1, 0),
Position = UDim2.new(1, -(16 + 56 + 6 + (2 - slot) * 28), 0, 84),
Size = UDim2.fromOffset(22, 20),
TextSize = 13,
Font = Enum.Font.GothamBold,
TextColor3 = THEME.text,
BackgroundColor3 = THEME.surface2,
AutoButtonColor = false,
BorderSizePixel = 0,
Visible = false,
}, form)
corner(button, 6)
local slotStroke = stroke(button, THEME.accentSoft, 1, 2)
slotButtons[slot] = { button = button, stroke = slotStroke }
button.Activated:Connect(function()
activeSlot = slot
updatePreview()
end)
end
refreshDual = function()
dualButton.BackgroundColor3 = dualOn and THEME.accent or THEME.surface2
dualButton.TextColor3 = dualOn and THEME.dark or THEME.text
for slot = 1, 2 do
local item = slotButtons[slot]
item.button.Visible = dualOn
local color = slot == 1 and selectedColor() or selectedColor2()
item.button.BackgroundColor3 = color
local luma = color.R * 0.3 + color.G * 0.59 + color.B * 0.11
item.button.TextColor3 = luma > 0.55 and THEME.dark or THEME.text
item.stroke.Transparency = (dualOn and activeSlot == slot) and 0 or 1
end
for i, ring in ipairs(swatches) do
local chosen = selectedColorIndex == i or (dualOn and selectedColor2Index == i)
tween(ring, 0.14, { Transparency = chosen and 0 or 1 })
end
end
dualButton.Activated:Connect(function()
dualOn = not dualOn
activeSlot = 1
updatePreview()
end)
local chips = {}
local function setStyle(key)
selectedStyle = key
for _, chip in ipairs(chips) do
local active = chip.key == key
tween(chip.button, 0.14, { BackgroundColor3 = active and THEME.accent or THEME.surface2 })
chip.button.TextColor3 = active and THEME.dark or THEME.text
chip.stroke.Transparency = active and 1 or 0.4
end
updatePreview()
end
for index, item in ipairs(STYLES) do
local button = new("TextButton", {
Text = item.title,
TextSize = 13,
Font = Enum.Font.GothamBold,
TextColor3 = THEME.text,
BackgroundColor3 = THEME.surface2,
AutoButtonColor = false,
BorderSizePixel = 0,
LayoutOrder = index,
}, styleRow)
corner(button, 8)
local chip = { key = item.key, button = button, stroke = stroke(button, THEME.line, 0.4, 1) }
table.insert(chips, chip)
button.MouseEnter:Connect(function()
if selectedStyle ~= chip.key then
tween(button, 0.1, { BackgroundColor3 = THEME.line })
end
end)
button.MouseLeave:Connect(function()
if selectedStyle ~= chip.key then
tween(button, 0.1, { BackgroundColor3 = THEME.surface2 })
end
end)
button.Activated:Connect(function()
setStyle(item.key)
end)
end
local fontChips = {}
local function setFont(key)
selectedFont = fontOf(key)
for _, chip in ipairs(fontChips) do
local active = chip.key == selectedFont.key
tween(chip.button, 0.14, { BackgroundColor3 = active and THEME.accent or THEME.surface2 })
chip.button.TextColor3 = active and THEME.dark or THEME.text
chip.stroke.Transparency = active and 1 or 0.4
end
updatePreview()
end
for index, item in ipairs(FONTS) do
local button = new("TextButton", {
Text = item.title,
Size = UDim2.fromOffset(100, 30),
TextSize = 13,
Font = Enum.Font.GothamBold,
TextColor3 = THEME.text,
BackgroundColor3 = THEME.surface2,
AutoButtonColor = false,
BorderSizePixel = 0,
LayoutOrder = index,
}, fontRow)
corner(button, 8)
local chip = { key = item.key, button = button, stroke = stroke(button, THEME.line, 0.4, 1) }
table.insert(fontChips, chip)
button.MouseEnter:Connect(function()
if selectedFont.key ~= chip.key then
tween(button, 0.1, { BackgroundColor3 = THEME.line })
end
end)
button.MouseLeave:Connect(function()
if selectedFont.key ~= chip.key then
tween(button, 0.1, { BackgroundColor3 = THEME.surface2 })
end
end)
button.Activated:Connect(function()
setFont(item.key)
end)
end
setFont(selectedFont.key)
nameBox:GetPropertyChangedSignal("Text"):Connect(function()
local text = nameBox.Text
local length = utf8.len(text)
if length and length > CONFIG.MaxNameLength then
local cut = utf8.offset(text, CONFIG.MaxNameLength + 1)
if cut then
nameBox.Text = string.sub(text, 1, cut - 1)
return
end
end
counter.Text = string.format("%d/%d", length or 0, CONFIG.MaxNameLength)
updatePreview()
end)
local refreshStudio
do -- BLOCK studio
local studioCard = new("Frame", {
Size = UDim2.fromOffset(588, 356),
BackgroundColor3 = THEME.surface,
BorderSizePixel = 0,
}, studioPage)
corner(studioCard, 12)
stroke(studioCard, THEME.line, 0.5, 1)
local studioGroups = {}
local function chipGroup(y, items, onPick)
local row = new("Frame", {
Position = UDim2.fromOffset(16, y),
Size = UDim2.new(1, -32, 0, 30),
BackgroundTransparency = 1,
}, studioCard)
new("UIListLayout", {
FillDirection = Enum.FillDirection.Horizontal,
Padding = UDim.new(0, 8),
SortOrder = Enum.SortOrder.LayoutOrder,
}, row)
local group = { chips = {} }
group.isActive = function()
return false
end
function group.refresh()
for _, chip in ipairs(group.chips) do
local active = group.isActive(chip.key)
tween(chip.button, 0.14, { BackgroundColor3 = active and THEME.accent or THEME.surface2 })
chip.button.TextColor3 = active and THEME.dark or THEME.text
chip.stroke.Transparency = active and 1 or 0.4
end
end
for index, item in ipairs(items) do
local button = new("TextButton", {
Text = item.title,
Size = UDim2.fromOffset(126, 30),
TextSize = 14,
Font = Enum.Font.GothamBold,
TextColor3 = THEME.text,
BackgroundColor3 = THEME.surface2,
AutoButtonColor = false,
BorderSizePixel = 0,
LayoutOrder = index,
}, row)
corner(button, 8)
local chip = { key = item.key, button = button, stroke = stroke(button, THEME.line, 0.4, 1) }
table.insert(group.chips, chip)
button.MouseEnter:Connect(function()
if not group.isActive(chip.key) then
tween(button, 0.1, { BackgroundColor3 = THEME.line })
end
end)
button.MouseLeave:Connect(function()
if not group.isActive(chip.key) then
tween(button, 0.1, { BackgroundColor3 = THEME.surface2 })
end
end)
button.Activated:Connect(function()
onPick(chip.key)
end)
end
table.insert(studioGroups, group)
return group
end
sectionTitle(studioCard, "SIZE", 12)
local sizeGroup = chipGroup(32, SIZES, function(key)
studio.size = key
refreshStudio()
end)
sizeGroup.isActive = function(key)
return studio.size == key
end
sectionTitle(studioCard, "LETTER SPACING", 76)
local gapGroup = chipGroup(96, SPACINGS, function(key)
studio.gap = key
refreshStudio()
end)
gapGroup.isActive = function(key)
return studio.gap == key
end
sectionTitle(studioCard, "SHAPE", 140)
local shapeGroup = chipGroup(160, SHAPES, function(key)
studio.shape = key
refreshStudio()
end)
shapeGroup.isActive = function(key)
return studio.shape == key
end
sectionTitle(studioCard, "TEXT CASE", 204)
local caseGroup = chipGroup(224, CASES, function(key)
studio.case = key
refreshStudio()
updatePreview()
end)
caseGroup.isActive = function(key)
return studio.case == key
end
sectionTitle(studioCard, "EFFECTS (can be combined)", 268)
local fxGroup = chipGroup(288, EFFECTS, function(key)
studio.fx[key] = not studio.fx[key]
refreshStudio()
end)
fxGroup.isActive = function(key)
return studio.fx[key] == true
end
textLabel(studioCard, "These options apply to the next name you create.", {
Position = UDim2.fromOffset(16, 330),
Size = UDim2.new(1, -32, 0, 14),
TextSize = 13,
TextColor3 = THEME.muted,
})
local installButton = makeButton(studioCard, {
Text = "Install effects script",
AnchorPoint = Vector2.new(1, 0),
Position = UDim2.new(1, -16, 0, 322),
Size = UDim2.fromOffset(196, 28),
TextSize = 14,
TextColor3 = THEME.accent,
}, { fill = THEME.surface2, stroke = THEME.accent, strokeTransparency = 0.6, radius = 8 })
installButton.Activated:Connect(function()
if H.onInstall then
H.onInstall()
end
end)
refreshStudio = function()
for _, group in ipairs(studioGroups) do
group.refresh()
end
end
end -- BLOCK studio
local templates = {}
local animated = {}
local packs = {}
local function stripInvisible(model)
for _, item in ipairs(model:GetDescendants()) do
if item:IsA("BasePart") and item.Transparency >= 0.95 then
item:Destroy()
end
end
end
local function toModel(source)
local copy = source:Clone()
if not copy then
return nil
end
for _, item in ipairs(copy:GetDescendants()) do
if item:IsA("LuaSourceContainer") then
item:Destroy()
end
end
if copy:IsA("LuaSourceContainer") then
copy:Destroy()
return nil
end
if copy:IsA("Model") then
copy.PrimaryPart = nil
stripInvisible(copy)
return copy
end
local container = Instance.new("Model")
container.Name = source.Name
if copy:IsA("BasePart") then
copy.Parent = container
return container
end
if copy:IsA("Folder") then
for _, child in ipairs(copy:GetChildren()) do
child.Parent = container
end
copy:Destroy()
stripInvisible(container)
return container
end
copy:Destroy()
container:Destroy()
return nil
end
local NUMBER_WORDS = {
zero = "0", one = "1", two = "2", three = "3", four = "4",
five = "5", six = "6", seven = "7", eight = "8", nine = "9",
}
local function keyFromName(name)
local tail = string.match(name, "([^/" .. utf8.char(92) .. "]+)$") or name
tail = trim(tail)
if #tail == 1 then
return tail
end
local lower = string.lower(tail)
if NUMBER_WORDS[lower] then
return NUMBER_WORDS[lower]
end
local digit = string.match(lower, "^number(%d)$") or string.match(lower, "^num(%d)$")
return digit
end
local function getPackIndex(font)
local state = packs[font.key]
if not state then
state = {}
packs[font.key] = state
end
if state.index then
return state.index
end
if state.failed or not font.packId or font.packId == 0 then
return nil
end
local root = loadObject(font.packId)
if not root then
state.failed = true
return nil
end
local index = {}
local function accept(child)
return child:IsA("Model") or child:IsA("BasePart") or child:IsA("Folder")
end
local function scan(container)
for _, child in ipairs(container:GetChildren()) do
if accept(child) then
local key = keyFromName(child.Name)
if key and not index[key] then
index[key] = child
end
end
end
end
scan(root)
if next(index) == nil then
for _, item in ipairs(root:GetDescendants()) do
if accept(item) then
local key = keyFromName(item.Name)
if key and not index[key] then
index[key] = item
end
end
end
end
if next(index) == nil then
state.failed = true
return nil
end
state.index = index
return index
end
local function oppositeCase(character)
local upper = string.upper(character)
if upper ~= character then
return upper
end
return string.lower(character)
end
local function getTemplate(font, character)
local cacheKey = font.key .. "|" .. character
local cached = templates[cacheKey]
if cached then
return cached
end
local source = nil
local index = getPackIndex(font)
if index then
source = index[character] or index[oppositeCase(character)]
end
local ids = font.letterIds or {}
if not source then
local id = ids[character] or ids[string.upper(character)] or ids[string.lower(character)]
if id then
source = loadObject(id)
end
end
if not source then
if (not font.packId or font.packId == 0) and next(ids) == nil then
return nil, 'Font "' .. font.title .. '" has no asset id. Set packId in CONFIG.Fonts.'
end
return nil, 'Letter "' .. character .. '" is not available in ' .. font.title
end
local model = toModel(source)
if not model then
return nil, 'Could not read the model for "' .. character .. '"'
end
model.Name = character
local pivot = model:GetPivot()
model:PivotTo(CFrame.new(pivot.Position))
if font.orient then
model:PivotTo(
CFrame.new(model:GetPivot().Position)
* CFrame.Angles(math.rad(font.orient.X), math.rad(font.orient.Y), math.rad(font.orient.Z))
)
end
local ok, boxCFrame, size = pcall(function()
return model:GetBoundingBox()
end)
if not ok or size.X <= 0 or size.Y <= 0 then
model:Destroy()
return nil, 'The model for "' .. character .. '" has no 3D parts'
end
local template = {
model = model,
center = boxCFrame.Position,
pivotPos = model:GetPivot().Position,
width = size.X,
height = size.Y,
}
templates[cacheKey] = template
return template
end
local function paintModel(model, color, style)
for _, item in ipairs(model:GetDescendants()) do
if item:IsA("BasePart") then
item.Anchored = true
item.CanCollide = false
item.CanTouch = false
item.CanQuery = false
item.CastShadow = true
item.Color = color
item.Material = style.material
item.Reflectance = style.reflectance
item.Transparency = style.transparency
if item:IsA("PartOperation") then
item.UsePartColor = true
elseif item:IsA("MeshPart") then
item.TextureID = ""
end
elseif item:IsA("SurfaceAppearance") then
item:Destroy()
end
end
end
local function flat(vector)
return Vector3.new(vector.X, 0, vector.Z)
end
local function findSpawnPosition()
local spawn = nil
pcall(function()
spawn = Workspace:FindFirstChildWhichIsA("SpawnLocation", true)
end)
if spawn then
return spawn.Position
end
return Vector3.new(0, 0.5, 0)
end
local function nextHeight(center, skipEntry)
local anchor = findSpawnPosition()
local y = anchor.Y + CONFIG.HeightOffset
for _, item in ipairs(names) do
if item ~= skipEntry and type(item.center) == "table" then
local c = Vector3.new(item.center[1], item.center[2], item.center[3])
if flat(c - center).Magnitude <= CONFIG.StackRadius and c.Y < anchor.Y + 200 then
y = math.max(y, c.Y + (item.h or 6) + 1.5)
end
end
end
return y
end
local function viewBasis()
local camera = Workspace.CurrentCamera
if camera then
local cf = camera.CFrame
local forward = flat(cf.LookVector)
if forward.Magnitude < 0.3 then
local up = flat(cf.UpVector)
if up.Magnitude > 0.05 then
forward = up
end
end
if forward.Magnitude < 0.05 then
forward = Vector3.new(0, 0, -1)
end
return cf.Position, cf.LookVector, forward.Unit
end
local character = player.Character
local root = character and character:FindFirstChild("HumanoidRootPart")
if root then
local forward = flat(root.CFrame.LookVector)
if forward.Magnitude < 0.05 then
forward = Vector3.new(0, 0, -1)
end
return root.Position, root.CFrame.LookVector, forward.Unit
end
local anchor = findSpawnPosition()
return anchor + Vector3.new(0, 10, 40), Vector3.new(0, 0, -1), Vector3.new(0, 0, -1)
end
local function getPlacement(skipEntry)
Workspace = game:GetService("Workspace")
local position, look, forward = viewBasis()
local anchor = findSpawnPosition()
local baseY = anchor.Y + CONFIG.HeightOffset
local point = nil
if look.Y < -0.05 then
local t = (baseY - position.Y) / look.Y
if t > 12 and t <= CONFIG.MaxPlaceDistance then
point = position + look * t
end
end
if not point then
point = position + forward * CONFIG.PlaceDistance
end
local flatPoint = Vector3.new(point.X, 0, point.Z)
local center = Vector3.new(point.X, nextHeight(flatPoint, skipEntry), point.Z)
local toward = -forward
local rotation = CFrame.lookAt(Vector3.zero, toward).Rotation
local right = forward:Cross(Vector3.yAxis)
return center, rotation, right.Unit
end
local function storePlacement(entry, center, rotation, right)
local comps = { rotation:GetComponents() }
entry.center = { center.X, center.Y, center.Z }
entry.rot = { table.unpack(comps, 4, 12) }
entry.right = { right.X, right.Y, right.Z }
end
local function modelNameOf(entry)
return "DZHUP_" .. entry.id
end
function H.hold(model)
if model:GetAttribute("DZ_Phys") == true then
return
end
for _, item in ipairs(model:GetDescendants()) do
if item:IsA("BasePart") and item.Name ~= "DZ_SweepOrb" then
pcall(function()
item.Anchored = true
item.CanCollide = false
item.CanTouch = false
if not item:FindFirstChild("DZ_HoldPos") then
local bp = Instance.new("BodyPosition")
bp.Name = "DZ_HoldPos"
bp.MaxForce = Vector3.new(1e9, 1e9, 1e9)
bp.P = 100000
bp.D = 2000
bp.Position = item.Position
bp.Parent = item
local bg = Instance.new("BodyGyro")
bg.Name = "DZ_HoldRot"
bg.MaxTorque = Vector3.new(1e9, 1e9, 1e9)
bg.P = 100000
bg.D = 2000
bg.CFrame = item.CFrame
bg.Parent = item
end
end)
end
end
end
function H.addParticles(group)
if group:GetAttribute("DZ_Particles") == true then
return
end
local c1 = group:GetAttribute("DZ_C1")
local c2 = group:GetAttribute("DZ_C2")
if typeof(c1) ~= "Color3" then
return
end
local seq = nil
if group:GetAttribute("DZ_Rainbow") == true then
local keys = {}
for i = 0, 6 do
table.insert(keys, ColorSequenceKeypoint.new(i / 6, Color3.fromHSV(math.min(i / 6, 0.99), 0.75, 1)))
end
seq = ColorSequence.new(keys)
elseif typeof(c2) == "Color3" then
seq = ColorSequence.new({
ColorSequenceKeypoint.new(0, c1),
ColorSequenceKeypoint.new(0.5, c2),
ColorSequenceKeypoint.new(1, c1),
})
else
seq = ColorSequence.new(c1, Color3.new(1, 1, 1))
end
for _, letter in ipairs(group:GetChildren()) do
if (letter:IsA("Model") or letter:IsA("BasePart")) and letter.Name ~= "DZ_SweepOrb" then
pcall(function()
local best, bestVolume = nil, nil
for _, item in ipairs(letter:GetDescendants()) do
if item:IsA("BasePart") then
local volume = item.Size.X * item.Size.Y * item.Size.Z
if not bestVolume or volume > bestVolume then
best, bestVolume = item, volume
end
end
end
if letter:IsA("BasePart") then
best = letter
end
if not best or best:FindFirstChild("DZ_Shimmer") then
return
end
local size = best.Size
local dot = math.clamp(math.max(size.X, size.Y) * 0.16, 0.15, 1.2)
local emitter = Instance.new("ParticleEmitter")
emitter.Name = "DZ_Shimmer"
emitter.Color = seq
emitter.LightEmission = 0.7
emitter.LightInfluence = 0
emitter.Lifetime = NumberRange.new(1.2, 2.2)
emitter.Rate = math.clamp(size.X * size.Y * 1.5, 6, 70)
emitter.Speed = NumberRange.new(0, 0.2)
emitter.Rotation = NumberRange.new(0, 360)
emitter.RotSpeed = NumberRange.new(-60, 60)
emitter.Size = NumberSequence.new({
NumberSequenceKeypoint.new(0, 0),
NumberSequenceKeypoint.new(0.3, dot),
NumberSequenceKeypoint.new(1, 0),
})
emitter.Transparency = NumberSequence.new({
NumberSequenceKeypoint.new(0, 1),
NumberSequenceKeypoint.new(0.2, 0.1),
NumberSequenceKeypoint.new(0.8, 0.3),
NumberSequenceKeypoint.new(1, 1),
})
emitter.LockedToPart = true
emitter.ZOffset = 0.5
pcall(function()
emitter.Shape = Enum.ParticleEmitterShape.Box
emitter.ShapeStyle = Enum.ParticleEmitterShapeStyle.Volume
end)
emitter.Parent = best
local sparkle = Instance.new("Sparkles")
sparkle.Name = "DZ_Sparkles"
sparkle.SparkleColor = typeof(c2) == "Color3" and c2 or Color3.fromHSV(math.random(), 0.7, 1)
sparkle.Parent = best
end)
end
end
pcall(function()
group:SetAttribute("DZ_Particles", true)
end)
end
function H.floatPhysics(group, amp)
if group:GetAttribute("DZ_PhysV") == 7 then
return true
end
amp = math.clamp(amp or 0.35, 0.1, 3)
local ok, err = pcall(function()
for _, item in ipairs(group:GetDescendants()) do
local n = item.Name
if n == "DZ_FloatAnchor" or n == "DZ_Weld" or n == "DZ_AntiGravity" or n == "DZ_FloatBody"
or n == "DZ_FloatTop" or n == "DZ_FloatSlider" or n == "DZ_FloatSpring" or n == "DZ_HoldPos"
or n == "DZ_HoldRot" or n == "DZ_FloatPos" or n == "DZ_Lift" then
item:Destroy()
end
end
local gravity = game:GetService("Workspace").Gravity
local omega = 1.4
local count = 0
for _, item in ipairs(group:GetDescendants()) do
if item:IsA("BasePart") and item.Name ~= "DZ_SweepOrb" then
count += 1
pcall(function()
local mass = item:GetMass()
if mass > 0 then
local base = PhysicalProperties.new(item.Material).Density
local density = math.clamp(base / mass, 0.01, 100)
item.CustomPhysicalProperties = PhysicalProperties.new(density, 0.3, 0.5, 1, 1)
end
end)
local mass = math.max(item:GetMass(), 0.001)
item.CanCollide = false
item.CanTouch = false
local lift = Instance.new("BodyForce")
lift.Name = "DZ_Lift"
lift.Force = Vector3.new(0, mass * gravity, 0)
lift.Parent = item
local spring = Instance.new("BodyPosition")
spring.Name = "DZ_FloatPos"
spring.MaxForce = Vector3.new(1e9, 1e9, 1e9)
spring.P = omega * omega
spring.D = 0
spring.Position = item.Position - Vector3.new(0, amp, 0)
spring.Parent = item
local gyro = Instance.new("BodyGyro")
gyro.Name = "DZ_HoldRot"
gyro.MaxTorque = Vector3.new(1e9, 1e9, 1e9)
gyro.P = 100000
gyro.D = 2000
gyro.CFrame = item.CFrame
gyro.Parent = item
item.Anchored = false
end
end
if count == 0 then
error("no parts")
end
group:SetAttribute("DZ_Phys", true)
group:SetAttribute("DZ_PhysV", 7)
end)
if not ok then
warn("[DZHUP] Float physics failed: " .. tostring(err))
end
return ok
end
function H.sweepOrb(group)
if group:GetAttribute("DZ_Sweep") == true then
return
end
local c2 = group:GetAttribute("DZ_C2")
if typeof(c2) ~= "Color3" or group:GetAttribute("DZ_Rainbow") == true then
return
end
pcall(function()
local first, last, minT, maxT = nil, nil, nil, nil
for _, letter in ipairs(group:GetChildren()) do
local t = letter:GetAttribute("DZ_T")
if type(t) == "number" then
if not minT or t < minT then
minT, first = t, letter
end
if not maxT or t > maxT then
maxT, last = t, letter
end
end
end
if not first or not last then
return
end
local a = first:GetPivot().Position
local b = last:GetPivot().Position
local span = b - a
local flatSpan = Vector3.new(span.X, 0, span.Z)
local dir = nil
if flatSpan.Magnitude > 0.1 then
dir = flatSpan.Unit
else
local root = group.PrimaryPart
local r = root and root.CFrame.RightVector or Vector3.xAxis
dir = Vector3.new(r.X, 0, r.Z).Unit
end
local half = flatSpan.Magnitude / 2 + 1.2
local center = (a + b) / 2
local height = 4
pcall(function()
height = first:GetExtentsSize().Y
end)
local normal = dir:Cross(Vector3.yAxis)
local camera = game:GetService("Workspace").CurrentCamera
if camera and (camera.CFrame.Position - center):Dot(normal) < 0 then
normal = -normal
end
local rest = center + normal * 1.6
local orb = Instance.new("Part")
orb.Name = "DZ_SweepOrb"
orb.Shape = Enum.PartType.Ball
orb.Size = Vector3.new(0.5, 0.5, 0.5)
orb.Transparency = 1
orb.CanCollide = false
orb.CanTouch = false
orb.CanQuery = false
orb.CastShadow = false
orb.Anchored = false
orb.CFrame = CFrame.new(rest - dir * half)
local base = PhysicalProperties.new(Enum.Material.Plastic).Density
local mass = orb:GetMass()
if mass > 0 then
orb.CustomPhysicalProperties = PhysicalProperties.new(math.clamp(base / mass, 0.01, 100), 0.3, 0.5, 1, 1)
end
orb.Parent = group
local light = Instance.new("PointLight")
light.Color = c2
light.Brightness = 4
light.Range = math.clamp(height * 1.6, 8, 32)
light.Shadows = false
light.Parent = orb
local omega = 2.2
local lift = Instance.new("BodyForce")
lift.Name = "DZ_Lift"
lift.Force = Vector3.new(0, math.max(orb:GetMass(), 0.001) * game:GetService("Workspace").Gravity, 0)
lift.Parent = orb
local spring = Instance.new("BodyPosition")
spring.Name = "DZ_SweepPos"
spring.MaxForce = Vector3.new(1e9, 1e9, 1e9)
spring.P = omega * omega
spring.D = 0
spring.Position = rest
spring.Parent = orb
group:SetAttribute("DZ_Sweep", true)
end)
end
function H.upgrade(group)
if group:GetAttribute("DZ_FX") ~= true then
return
end
if group:GetAttribute("DZ_SparkOpt") == true then
H.addParticles(group)
elseif group:GetAttribute("DZ_Particles") == true then
for _, item in ipairs(group:GetDescendants()) do
if item.Name == "DZ_Shimmer" or item.Name == "DZ_Sparkles" then
item:Destroy()
end
end
pcall(function()
group:SetAttribute("DZ_Particles", nil)
end)
end
if group:GetAttribute("DZ_Colors") == true then
H.sweepOrb(group)
end
if group:GetAttribute("DZ_Float") == true and group:GetAttribute("DZ_PhysV") ~= 7 then
H.floatPhysics(group, group:GetAttribute("DZ_Amp") or 0.35)
end
end
function H.adopt(group)
if group:GetAttribute("DZ_FX") ~= true then
return
end
local c1 = group:GetAttribute("DZ_C1")
local c2 = group:GetAttribute("DZ_C2")
if typeof(c1) ~= "Color3" then
return
end
local info = {
c1 = c1,
c2 = typeof(c2) == "Color3" and c2 or nil,
rainbow = group:GetAttribute("DZ_Rainbow") == true,
float = group:GetAttribute("DZ_Float") == true and group:GetAttribute("DZ_Phys") ~= true,
base = group:GetPivot(),
amp = group:GetAttribute("DZ_Amp") or 0.35,
phase = group:GetAttribute("DZ_Phase") or 0,
}
pcall(function()
group:SetAttribute("DZ_Base", info.base)
end)
if group:GetAttribute("DZ_Colors") == true and (info.c2 or info.rainbow) then
info.letters = {}
for _, letter in ipairs(group:GetChildren()) do
local t = letter:GetAttribute("DZ_T")
if type(t) == "number" then
local parts = {}
if letter:IsA("BasePart") then
table.insert(parts, letter)
end
for _, item in ipairs(letter:GetDescendants()) do
if item:IsA("BasePart") then
table.insert(parts, item)
end
end
table.insert(info.letters, {
t = t,
parts = parts,
light = letter:FindFirstChildWhichIsA("PointLight", true),
})
end
end
end
animated[group] = info
end
do -- BLOCK effectsInstaller
local EFFECT_VERSION = 8
local EFFECT_MARK = "DZ HUP | Name Effects"
local EFFECT_SOURCE = [==[
--[[
DZ HUP | Name Effects
Installed automatically by the DZ HUP Name Maker.
Keeps every letter anchored (names never fall) and plays dual color flow, rainbow, float
and glow from the data saved inside each name (Workspace > DZHUP_Names).
]]
local RunService = game:GetService("RunService")
local Workspace = game:GetService("Workspace")
local FOLDER_NAME = "DZHUP_Names"
local tracked = {}
local function anchorAll(model)
for _, item in ipairs(model:GetDescendants()) do
if item:IsA("BasePart") and item.Name ~= "DZ_SweepOrb" then
item.Anchored = true
item.CanCollide = false
item.CanTouch = false
end
end
end
local function collect(model)
local info = {
c1 = model:GetAttribute("DZ_C1"),
c2 = model:GetAttribute("DZ_C2"),
colors = model:GetAttribute("DZ_Colors") == true,
rainbow = model:GetAttribute("DZ_Rainbow") == true,
floating = model:GetAttribute("DZ_Float") == true,
amp = model:GetAttribute("DZ_Amp") or 0.35,
phase = model:GetAttribute("DZ_Phase") or 0,
base = model:GetAttribute("DZ_Base"),
speed = model:GetAttribute("DZ_Speed") or 0.35,
spread = model:GetAttribute("DZ_Spread") or 1,
letters = {},
}
if typeof(info.c1) ~= "Color3" then
info.c1 = Color3.new(1, 1, 1)
end
if typeof(info.c2) ~= "Color3" then
info.c2 = nil
end
if typeof(info.base) ~= "CFrame" then
info.base = model:GetPivot()
end
if info.colors then
for _, letter in ipairs(model:GetChildren()) do
local t = letter:GetAttribute("DZ_T")
if type(t) == "number" then
local parts = {}
if letter:IsA("BasePart") then
parts[#parts + 1] = letter
end
for _, item in ipairs(letter:GetDescendants()) do
if item:IsA("BasePart") then
parts[#parts + 1] = item
end
end
info.letters[#info.letters + 1] = {
t = t,
parts = parts,
light = letter:FindFirstChildWhichIsA("PointLight", true),
}
end
end
end
return info
end
local function track(model)
if not model:IsA("Model") or string.sub(model.Name, 1, 6) ~= "DZHUP_" then
return
end
if model:GetAttribute("DZ_Phys") ~= true then
pcall(anchorAll, model)
end
if not tracked[model] and model:GetAttribute("DZ_FX") == true then
local ok, info = pcall(collect, model)
if ok then
tracked[model] = info
end
end
end
local function watch(folder)
for _, model in ipairs(folder:GetChildren()) do
track(model)
end
folder.ChildAdded:Connect(function(model)
task.wait(0.2)
track(model)
end)
task.spawn(function()
while folder.Parent do
for _, model in ipairs(folder:GetChildren()) do
pcall(track, model)
end
task.wait(2)
end
end)
end
watch(Workspace)
local last = 0
RunService.Heartbeat:Connect(function()
local now = os.clock()
if now - last < 0.05 then
return
end
last = now
for model, info in pairs(tracked) do
if not model.Parent then
tracked[model] = nil
else
if info.colors then
for _, letter in ipairs(info.letters) do
local blended = nil
if info.rainbow then
blended = Color3.fromHSV((letter.t * 0.8 - now * 0.12) % 1, 0.8, 1)
elseif info.c2 then
local wave = (math.sin((letter.t * info.spread - now * info.speed) * math.pi * 2) + 1) / 2
blended = info.c1:Lerp(info.c2, wave)
end
if blended then
for _, part in ipairs(letter.parts) do
part.Color = blended
end
if letter.light then
letter.light.Color = blended
end
end
end
end
if info.floating and model:GetAttribute("DZ_Phys") ~= true then
model:PivotTo(info.base + Vector3.new(0, math.sin(now * 1.4 + info.phase) * info.amp, 0))
end
end
end
end)
]==]
local log = {}
local function note(text)
table.insert(log, text)
end
local function elevate(level)
local names_ = { "setthreadidentity", "set_thread_identity", "setidentity", "set_identity", "setthreadcontext", "set_thread_context" }
for _, key in ipairs(names_) do
local fn = genv[key] or _G[key]
if type(fn) == "function" and pcall(fn, level) then
return true
end
end
local syn = genv.syn
if type(syn) == "table" and type(syn.set_thread_identity) == "function" and pcall(syn.set_thread_identity, level) then
return true
end
return false
end
local function findExisting()
local sss = game:GetService("ServerScriptService")
local found = sss:FindFirstChild("DZHUP_Effects") or Workspace:FindFirstChild("DZHUP_Effects")
return found
end
local function needsInstall()
local existing = findExisting()
if not existing then
return true
end
local version = 0
pcall(function()
version = existing:GetAttribute("DZ_Version") or 0
end)
return version < EFFECT_VERSION
end
local function writeSource(target)
local methods = {
{ "direct", function()
target.Source = EFFECT_SOURCE
end },
{ "setscriptable", function()
if type(setscriptable) ~= "function" then
error("setscriptable not available")
end
setscriptable(target, "Source", true)
target.Source = EFFECT_SOURCE
end },
{ "sethiddenproperty", function()
if type(sethiddenproperty) ~= "function" then
error("sethiddenproperty not available")
end
sethiddenproperty(target, "Source", EFFECT_SOURCE)
end },
{ "ScriptEditorService", function()
game:GetService("ScriptEditorService"):UpdateSourceAsync(target, function()
return EFFECT_SOURCE
end)
end },
{ "ScriptDocument", function()
local service = game:GetService("ScriptEditorService")
local doc = service:FindScriptDocument(target)
if not doc then
service:OpenScriptDocumentAsync(target)
doc = service:FindScriptDocument(target)
end
if not doc then
error("no script document")
end
doc:EditTextAsync(EFFECT_SOURCE, 1, 1, 1, 1)
end },
}
local unverified = false
for _, level in ipairs({ 8, 5, 4, 2 }) do
elevate(level)
for _, method in ipairs(methods) do
local ok, err = pcall(method[2])
if not ok then
note(string.format("[id %d] %s: %s", level, method[1], tostring(err)))
end
local readOk, back = pcall(function()
return target.Source
end)
if readOk and type(back) == "string" and string.find(back, EFFECT_MARK, 1, true) then
return true, "verified"
end
if ok and not (readOk and type(back) == "string" and #back > 0) then
unverified = true
end
end
end
if unverified then
return true, "unverified"
end
return false
end
local function install()
log = {}
local target = findExisting()
local created = false
if not target then
for _, parent in ipairs({ game:GetService("ServerScriptService"), Workspace }) do
local ok, made = pcall(function()
local s = Instance.new("Script")
s.Name = "DZHUP_Effects"
s.Parent = parent
return s
end)
if ok and made and made.Parent == parent then
target = made
created = true
break
end
note("create in " .. parent.Name .. ": " .. tostring(made))
if ok and made then
pcall(function()
made:Destroy()
end)
end
end
end
if not target then
return false
end
local ok, how = writeSource(target)
if ok then
pcall(function()
target.Enabled = true
target:SetAttribute("DZ_Version", EFFECT_VERSION)
end)
return true, how
end
if created then
pcall(function()
target:Destroy()
end)
end
return false
end
local failedOnce = false
function H.ensureEffects(silent, force)
if not force and not needsInstall() then
return true, "Effects script is already installed"
end
local ok, how = install()
if ok then
if not silent then
print("[DZHUP] Effects script installed (" .. tostring(how) .. ") in " .. tostring(findExisting() and findExisting().Parent and findExisting().Parent.Name))
end
if how == "unverified" then
return true, "Effects script written (could not read it back to verify)"
end
return true, "Effects script installed"
end
if not failedOnce or force then
failedOnce = true
warn("[DZHUP] This editor blocks writing code into a Script. Why:")
for _, line in ipairs(log) do
warn("[DZHUP]   " .. line)
end
warn("[DZHUP] Names are still held in place (anchored + body movers) and colors are saved in the letters. Only live animation in Play mode needs the script.")
if force then
copyText(EFFECT_SOURCE)
end
end
return false, "Editor blocks scripts. Names stay in place; animation only runs from the executor."
end
function H.onInstall()
task.spawn(function()
local ok, message = H.ensureEffects(false, true)
showToast(message, ok)
end)
end
end -- BLOCK effectsInstaller
local function buildName(entry)
local font = fontOf(entry.font)
local style = STYLE_DEFS[entry.style] or STYLE_DEFS.Plastic
local color = Color3.fromRGB(entry.color[1], entry.color[2], entry.color[3])
local color2 = nil
if type(entry.color2) == "table" then
color2 = Color3.fromRGB(entry.color2[1], entry.color2[2], entry.color2[3])
end
local scale = type(entry.size) == "number" and math.clamp(entry.size, 0.2, 6) or 1
local gapMul = type(entry.gap) == "number" and math.clamp(entry.gap, 0, 6) or 1
local shape = entry.shape or "Straight"
local fx = type(entry.fx) == "table" and entry.fx or {}
local colorAnim = color2 ~= nil or fx.rainbow == true
local center = Vector3.new(entry.center[1], entry.center[2], entry.center[3])
local rotation = CFrame.new(0, 0, 0, table.unpack(entry.rot))
local normal = rotation.LookVector
local right = Vector3.new(entry.right[1], entry.right[2], entry.right[3])
local frontNegZ = font.frontNegZ
if frontNegZ == nil then
frontNegZ = CONFIG.FrontFaceIsNegativeZ
end
if not frontNegZ then
rotation = rotation * CFrame.Angles(0, math.pi, 0)
end
local pieces = {}
local letterCount, widthSum, maxHeight = 0, 0, 1
for _, codepoint in utf8.codes(entry.name) do
local character = utf8.char(codepoint)
if string.match(character, "^%s$") then
table.insert(pieces, { space = true })
else
local template, templateError = getTemplate(font, character)
if not template then
return nil, templateError
end
table.insert(pieces, { template = template })
letterCount += 1
widthSum += template.width * scale
maxHeight = math.max(maxHeight, template.height * scale)
end
end
local gap = CONFIG.LetterGap * gapMul * scale
local spaceWidth = letterCount > 0 and (widthSum / letterCount) * CONFIG.SpaceWidthRatio or 1
local totalWidth = -gap
for _, piece in ipairs(pieces) do
piece.width = piece.template and piece.template.width * scale or spaceWidth
totalWidth += piece.width + gap
end
local arcAngle = math.min(math.rad(110), totalWidth / (maxHeight * 3))
local radius = arcAngle > 0.01 and totalWidth / arcAngle or nil
local function shapeAt(xc)
if (shape == "ArcUp" or shape == "ArcDown") and radius then
local phi = xc / radius
local sign = shape == "ArcUp" and 1 or -1
return radius * math.sin(phi), sign * (radius * math.cos(phi) - radius), -sign * phi
elseif shape == "Wave" then
local amp = maxHeight * 0.28
local k = (math.pi * 2 * 1.5) / math.max(totalWidth, 0.01)
return xc, amp * math.sin(k * xc), math.atan(amp * k * math.cos(k * xc))
end
return xc, 0, 0
end
local group = Instance.new("Model")
group.Name = modelNameOf(entry)
local cursor = -totalWidth / 2
local firstPart = nil
local waveLetters = {}
for _, piece in ipairs(pieces) do
local template = piece.template
if template then
local letter = template.model:Clone()
local appliedScale = 1
if scale ~= 1 then
if pcall(function()
letter:ScaleTo(scale)
end) then
appliedScale = scale
end
end
paintModel(letter, color, style)
local xc = cursor + piece.width / 2
local dx, dy, roll = shapeAt(xc)
local rollCF = CFrame.fromAxisAngle(normal, roll)
local up = rollCF:VectorToWorldSpace(Vector3.yAxis)
local scaledCenter = template.pivotPos + (template.center - template.pivotPos) * appliedScale
local target = center + right * dx + Vector3.yAxis * dy + up * (template.height * appliedScale / 2)
local placement = CFrame.new(target) * rollCF * rotation * CFrame.new(-scaledCenter)
letter:PivotTo(placement * letter:GetPivot())
letter.Name = template.model.Name
letter.Parent = group
local light = nil
if fx.glow then
local anchorPart = letter:FindFirstChildWhichIsA("BasePart", true)
if anchorPart then
light = Instance.new("PointLight")
light.Color = color
light.Brightness = 2
light.Range = math.clamp(10 * scale, 6, 30)
light.Shadows = false
light.Parent = anchorPart
end
end
if colorAnim then
local parts = {}
for _, item in ipairs(letter:GetDescendants()) do
if item:IsA("BasePart") then
table.insert(parts, item)
end
end
local t = totalWidth > 0 and (xc + totalWidth / 2) / totalWidth or 0
pcall(function()
letter:SetAttribute("DZ_T", t)
end)
local staticColor = nil
if fx.rainbow then
staticColor = Color3.fromHSV((t * 0.8) % 1, 0.8, 1)
elseif color2 then
local w = (math.sin(t * CONFIG.WaveSpread * math.pi * 2) + 1) / 2
staticColor = color:Lerp(color2, w)
end
if staticColor then
for _, part in ipairs(parts) do
part.Color = staticColor
end
if light then
light.Color = staticColor
end
end
table.insert(waveLetters, { parts = parts, t = t, light = light })
end
firstPart = firstPart or letter:FindFirstChildWhichIsA("BasePart", true)
end
cursor += piece.width + gap
end
if not firstPart then
group:Destroy()
return nil, "No letters could be created"
end
if entry.style == "Modern" then
local highlight = Instance.new("Highlight")
highlight.Name = "ModernEdge"
highlight.Adornee = group
highlight.FillTransparency = 1
highlight.OutlineColor = color
highlight.OutlineTransparency = 0.2
highlight.DepthMode = Enum.HighlightDepthMode.Occluded
highlight.Parent = group
end
group.PrimaryPart = firstPart
group.Parent = H.getFolder()
pcall(function()
group:SetAttribute("DZ_Name", true)
end)
H.hold(group)
pcall(function()
local _, size = group:GetBoundingBox()
entry.h = size.Y
end)
if colorAnim or fx.float or fx.sparkles then
local fxBase = group:GetPivot()
local fxAmp = 0.35 * math.max(scale, 0.6)
local fxPhase = math.random() * math.pi * 2
pcall(function()
group:SetAttribute("DZ_FX", true)
group:SetAttribute("DZ_C1", color)
if color2 then
group:SetAttribute("DZ_C2", color2)
end
group:SetAttribute("DZ_Colors", colorAnim)
group:SetAttribute("DZ_Rainbow", fx.rainbow == true)
group:SetAttribute("DZ_Float", fx.float == true)
group:SetAttribute("DZ_Amp", fxAmp)
group:SetAttribute("DZ_Phase", fxPhase)
group:SetAttribute("DZ_Base", fxBase)
group:SetAttribute("DZ_Speed", CONFIG.WaveSpeed)
group:SetAttribute("DZ_Spread", CONFIG.WaveSpread)
end)
if fx.sparkles then
pcall(function()
group:SetAttribute("DZ_SparkOpt", true)
end)
H.addParticles(group)
end
if colorAnim then
H.sweepOrb(group)
end
local physOk = false
if fx.float then
physOk = H.floatPhysics(group, fxAmp) == true
end
animated[group] = {
c1 = color,
c2 = color2,
rainbow = fx.rainbow == true,
letters = colorAnim and waveLetters or nil,
float = fx.float == true and not physOk,
base = fxBase,
amp = fxAmp,
phase = fxPhase,
}
end
return group
end
do -- BLOCK heartbeat
local lastWave = 0
on(RunService.Heartbeat, function()
local now = os.clock()
if now - lastWave < 0.033 then
return
end
lastWave = now
for group, info in pairs(animated) do
if not group.Parent then
animated[group] = nil
else
if info.letters then
for _, letter in ipairs(info.letters) do
local blended
if info.rainbow then
blended = Color3.fromHSV((letter.t * 0.8 - now * 0.12) % 1, 0.8, 1)
else
local wave = (math.sin((letter.t * CONFIG.WaveSpread - now * CONFIG.WaveSpeed) * math.pi * 2) + 1) / 2
blended = info.c1:Lerp(info.c2, wave)
end
for _, part in ipairs(letter.parts) do
part.Color = blended
end
if letter.light then
letter.light.Color = blended
end
end
end
if info.float then
group:PivotTo(info.base + Vector3.new(0, math.sin(now * 1.4 + info.phase) * info.amp, 0))
end
end
end
end)
end -- BLOCK heartbeat
local renderList
do -- BLOCK mynames
textLabel(listPage, "Saved names", {
Position = UDim2.fromOffset(4, 0),
Size = UDim2.new(1, -8, 0, 22),
Font = Enum.Font.GothamBold,
TextSize = 16,
})
local listCount = textLabel(listPage, "", {
Position = UDim2.fromOffset(4, 0),
Size = UDim2.new(1, -8, 0, 22),
TextSize = 15,
TextColor3 = THEME.muted,
TextXAlignment = Enum.TextXAlignment.Right,
})
local listFrame = new("ScrollingFrame", {
Position = UDim2.fromOffset(0, 28),
Size = UDim2.new(1, 0, 1, -28),
BackgroundColor3 = THEME.surface,
BorderSizePixel = 0,
ScrollBarThickness = 3,
ScrollBarImageColor3 = THEME.muted,
CanvasSize = UDim2.new(),
AutomaticCanvasSize = Enum.AutomaticSize.Y,
ScrollingDirection = Enum.ScrollingDirection.Y,
}, listPage)
corner(listFrame, 12)
stroke(listFrame, THEME.line, 0.5, 1)
new("UIPadding", {
PaddingTop = UDim.new(0, 8),
PaddingBottom = UDim.new(0, 8),
PaddingLeft = UDim.new(0, 8),
PaddingRight = UDim.new(0, 10),
}, listFrame)
new("UIListLayout", { Padding = UDim.new(0, 7), SortOrder = Enum.SortOrder.LayoutOrder }, listFrame)
local emptyState = textLabel(listPage, "No saved names yet" .. utf8.char(10) .. "Create your first one from the Create tab", {
Position = UDim2.fromOffset(0, 28),
Size = UDim2.new(1, 0, 1, -28),
TextSize = 15,
TextColor3 = THEME.muted,
TextWrapped = true,
TextXAlignment = Enum.TextXAlignment.Center,
})
local function moveEntry(entry)
task.spawn(function()
local old = H.getFolder():FindFirstChild(modelNameOf(entry))
if old then
old:Destroy()
end
local center, rotation, right = getPlacement(entry)
storePlacement(entry, center, rotation, right)
local ok, group, err = pcall(buildName, entry)
persist()
if ok and group then
showToast("Moved in front of you", true)
else
showToast(tostring(ok and err or group or "Could not move the name"), false)
end
end)
end
local function deleteEntry(entry)
local old = H.getFolder():FindFirstChild(modelNameOf(entry))
if old then
old:Destroy()
end
for i, item in ipairs(names) do
if item == entry then
table.remove(names, i)
break
end
end
persist()
renderList()
showToast("Name deleted", true)
end
function renderList()
for _, child in ipairs(listFrame:GetChildren()) do
if child:IsA("GuiObject") then
child:Destroy()
end
end
local sorted = table.clone(names)
table.sort(sorted, function(a, b)
return (a.order or 0) > (b.order or 0)
end)
if H.setSubTitle then
H.setSubTitle("saved", string.format("Saved (%d)", #sorted))
end
listCount.Text = string.format("%d / %d", #sorted, CONFIG.MaxNames)
emptyState.Visible = #sorted == 0
listFrame.Visible = #sorted > 0
for index, entry in ipairs(sorted) do
local row = new("Frame", {
Size = UDim2.new(1, 0, 0, 62),
BackgroundColor3 = THEME.surface2,
BorderSizePixel = 0,
LayoutOrder = index,
}, listFrame)
corner(row, 10)
stroke(row, THEME.line, 0.7, 1)
local dot = new("Frame", {
AnchorPoint = Vector2.new(0, 0.5),
Position = UDim2.new(0, 14, 0.5, 0),
Size = UDim2.fromOffset(32, 32),
BackgroundColor3 = Color3.fromRGB(entry.color[1], entry.color[2], entry.color[3]),
BorderSizePixel = 0,
}, row)
corner(dot, 9)
stroke(dot, THEME.text, 0.7, 1)
if type(entry.color2) == "table" then
dot.BackgroundColor3 = Color3.new(1, 1, 1)
new("UIGradient", {
Color = ColorSequence.new(
Color3.fromRGB(entry.color[1], entry.color[2], entry.color[3]),
Color3.fromRGB(entry.color2[1], entry.color2[2], entry.color2[3])
),
Rotation = 45,
}, dot)
end
textLabel(row, tostring(entry.name), {
Position = UDim2.fromOffset(60, 10),
Size = UDim2.new(1, -230, 0, 24),
Font = Enum.Font.GothamBold,
TextSize = 19,
TextTruncate = Enum.TextTruncate.AtEnd,
})
local details = fontOf(entry.font).title .. "  |  " .. (STYLE_TITLES[entry.style] or "Plastic")
if entry.shape and SHAPE_TITLES[entry.shape] then
details = details .. "  |  " .. SHAPE_TITLES[entry.shape]
end
if type(entry.fx) == "table" then
for _, item in ipairs(EFFECTS) do
if entry.fx[item.key] then
details = details .. "  |  " .. FX_TITLES[item.key]
end
end
end
textLabel(row, details, {
Position = UDim2.fromOffset(60, 35),
Size = UDim2.new(1, -230, 0, 18),
TextTruncate = Enum.TextTruncate.AtEnd,
TextSize = 14,
TextColor3 = THEME.muted,
})
local deleteButton = makeButton(row, {
Text = "Delete",
AnchorPoint = Vector2.new(1, 0.5),
Position = UDim2.new(1, -10, 0.5, 0),
Size = UDim2.fromOffset(72, 32),
TextSize = 15,
TextColor3 = THEME.danger,
}, { fill = THEME.surface, stroke = THEME.danger, strokeTransparency = 0.6, radius = 8 })
local moveButton = makeButton(row, {
Text = "Move here",
AnchorPoint = Vector2.new(1, 0.5),
Position = UDim2.new(1, -90, 0.5, 0),
Size = UDim2.fromOffset(82, 32),
TextSize = 15,
TextColor3 = THEME.accent,
}, { fill = THEME.surface, stroke = THEME.accent, strokeTransparency = 0.6, radius = 8 })
moveButton.Activated:Connect(function()
moveEntry(entry)
end)
local armed = false
deleteButton.Activated:Connect(function()
if not armed then
armed = true
deleteButton.Text = "Confirm?"
deleteButton.TextColor3 = THEME.text
tween(deleteButton, 0.12, { BackgroundColor3 = THEME.danger })
task.delay(2.5, function()
if armed and deleteButton.Parent then
armed = false
deleteButton.Text = "Delete"
deleteButton.TextColor3 = THEME.danger
tween(deleteButton, 0.12, { BackgroundColor3 = THEME.surface })
end
end)
return
end
deleteEntry(entry)
end)
end
end
local clearButton = makeButton(listPage, {
Text = "Clear all",
AnchorPoint = Vector2.new(1, 0),
Position = UDim2.new(1, -62, 0, 0),
Size = UDim2.fromOffset(74, 22),
TextSize = 14,
TextColor3 = THEME.danger,
}, { fill = THEME.surface, stroke = THEME.danger, strokeTransparency = 0.6, radius = 7 })
local clearArmed = false
clearButton.Activated:Connect(function()
if #names == 0 then
showToast("Nothing to clear", false)
return
end
if not clearArmed then
clearArmed = true
clearButton.Text = "Confirm?"
clearButton.TextColor3 = THEME.text
tween(clearButton, 0.12, { BackgroundColor3 = THEME.danger })
task.delay(2.5, function()
if clearArmed and clearButton.Parent then
clearArmed = false
clearButton.Text = "Clear all"
clearButton.TextColor3 = THEME.danger
tween(clearButton, 0.12, { BackgroundColor3 = THEME.surface })
end
end)
return
end
clearArmed = false
clearButton.Text = "Clear all"
clearButton.TextColor3 = THEME.danger
tween(clearButton, 0.12, { BackgroundColor3 = THEME.surface })
for _, item in ipairs(names) do
local old = H.getFolder():FindFirstChild(modelNameOf(item))
if old then
old:Destroy()
end
end
table.clear(names)
persist()
renderList()
showToast("All names deleted", true)
end)
end -- BLOCK mynames
do -- BLOCK creator
local aboutLeft = new("Frame", {
Size = UDim2.fromOffset(240, 392),
BackgroundColor3 = THEME.surface,
BorderSizePixel = 0,
}, aboutPage)
corner(aboutLeft, 12)
stroke(aboutLeft, THEME.line, 0.5, 1)
local avatarHolder = new("Frame", {
AnchorPoint = Vector2.new(0.5, 0),
Position = UDim2.new(0.5, 0, 0, 30),
Size = UDim2.fromOffset(116, 116),
BackgroundTransparency = 1,
}, aboutLeft)
local avatarGlow = new("Frame", {
AnchorPoint = Vector2.new(0.5, 0.5),
Position = UDim2.fromScale(0.5, 0.5),
Size = UDim2.fromOffset(134, 134),
BackgroundColor3 = THEME.accent,
BackgroundTransparency = 0.86,
BorderSizePixel = 0,
}, avatarHolder)
corner(avatarGlow, 100)
loop(avatarGlow, 1.4, { BackgroundTransparency = 0.62, Size = UDim2.fromOffset(150, 150) })
local avatarRing = new("Frame", {
Size = UDim2.fromScale(1, 1),
BackgroundColor3 = THEME.surface2,
BorderSizePixel = 0,
}, avatarHolder)
corner(avatarRing, 100)
local ringStroke = stroke(avatarRing, Color3.new(1, 1, 1), 0, 3)
local ringGradient = new("UIGradient", {
Color = ColorSequence.new({
ColorSequenceKeypoint.new(0, THEME.accentSoft),
ColorSequenceKeypoint.new(0.5, THEME.accent),
ColorSequenceKeypoint.new(1, THEME.accentSoft),
}),
Transparency = NumberSequence.new({
NumberSequenceKeypoint.new(0, 0),
NumberSequenceKeypoint.new(0.55, 0.85),
NumberSequenceKeypoint.new(1, 0),
}),
}, ringStroke)
loop(ringGradient, 3, { Rotation = 360 }, Enum.EasingStyle.Linear, false)
local avatarInner = new("Frame", {
AnchorPoint = Vector2.new(0.5, 0.5),
Position = UDim2.fromScale(0.5, 0.5),
Size = UDim2.new(1, -12, 1, -12),
BackgroundColor3 = THEME.header,
BorderSizePixel = 0,
ClipsDescendants = true,
}, avatarRing)
corner(avatarInner, 100)
local avatarLetter = textLabel(avatarInner, "R", {
Size = UDim2.fromScale(1, 1),
Font = Enum.Font.GothamBlack,
TextSize = 44,
TextColor3 = THEME.accent,
TextXAlignment = Enum.TextXAlignment.Center,
})
local avatarImage = new("ImageLabel", {
Size = UDim2.fromScale(1, 1),
BackgroundTransparency = 1,
ScaleType = Enum.ScaleType.Crop,
Image = "",
Visible = false,
}, avatarInner)
corner(avatarImage, 100)
textLabel(aboutLeft, CONFIG.Creator, {
Position = UDim2.fromOffset(0, 164),
Size = UDim2.new(1, 0, 0, 26),
Font = Enum.Font.GothamBlack,
TextSize = 22,
TextXAlignment = Enum.TextXAlignment.Center,
})
textLabel(aboutLeft, "Creator of this system", {
Position = UDim2.fromOffset(0, 192),
Size = UDim2.new(1, 0, 0, 16),
TextSize = 15,
TextColor3 = THEME.muted,
TextXAlignment = Enum.TextXAlignment.Center,
})
local communityPill = new("Frame", {
AnchorPoint = Vector2.new(0.5, 0),
Position = UDim2.new(0.5, 0, 0, 224),
Size = UDim2.fromOffset(120, 28),
BackgroundColor3 = THEME.surface2,
BorderSizePixel = 0,
}, aboutLeft)
corner(communityPill, 14)
stroke(communityPill, THEME.accent, 0.55, 1)
textLabel(communityPill, CONFIG.Community, {
Size = UDim2.fromScale(1, 1),
Font = Enum.Font.GothamBold,
TextSize = 15,
TextColor3 = THEME.accent,
TextXAlignment = Enum.TextXAlignment.Center,
})
local aboutRight = new("Frame", {
Position = UDim2.fromOffset(252, 0),
Size = UDim2.fromOffset(336, 392),
BackgroundColor3 = THEME.surface,
BorderSizePixel = 0,
}, aboutPage)
corner(aboutRight, 12)
stroke(aboutRight, THEME.line, 0.5, 1)
textLabel(aboutRight, "CONNECT WITH ME", {
Position = UDim2.fromOffset(16, 14),
Size = UDim2.new(1, -32, 0, 16),
Font = Enum.Font.GothamBold,
TextSize = 15,
TextColor3 = THEME.muted,
})
local function copyLink(link, doneMessage)
if copyText(link) then
showToast(doneMessage, true)
else
showToast("Clipboard is not supported. " .. link, false)
end
end
local function contactCard(y, letter, color, title, sub, link, doneMessage)
local button = makeButton(aboutRight, {
Text = "",
Position = UDim2.fromOffset(16, y),
Size = UDim2.fromOffset(304, 68),
}, { fill = THEME.surface2, stroke = color, strokeTransparency = 0.6, radius = 12 })
local icon = new("Frame", {
AnchorPoint = Vector2.new(0, 0.5),
Position = UDim2.new(0, 14, 0.5, 0),
Size = UDim2.fromOffset(42, 42),
BackgroundColor3 = color,
BorderSizePixel = 0,
}, button)
corner(icon, 11)
textLabel(icon, letter, {
Size = UDim2.fromScale(1, 1),
Font = Enum.Font.GothamBlack,
TextSize = 20,
TextColor3 = Color3.new(1, 1, 1),
TextXAlignment = Enum.TextXAlignment.Center,
})
textLabel(button, title, {
Position = UDim2.fromOffset(68, 14),
Size = UDim2.new(1, -150, 0, 20),
Font = Enum.Font.GothamBold,
TextSize = 17,
})
textLabel(button, sub, {
Position = UDim2.fromOffset(68, 36),
Size = UDim2.new(1, -150, 0, 16),
TextSize = 14,
TextColor3 = THEME.muted,
})
local chip = new("Frame", {
AnchorPoint = Vector2.new(1, 0.5),
Position = UDim2.new(1, -12, 0.5, 0),
Size = UDim2.fromOffset(60, 26),
BackgroundColor3 = color,
BackgroundTransparency = 0.75,
BorderSizePixel = 0,
}, button)
corner(chip, 8)
textLabel(chip, "COPY", {
Size = UDim2.fromScale(1, 1),
Font = Enum.Font.GothamBold,
TextSize = 14,
TextXAlignment = Enum.TextXAlignment.Center,
})
button.Activated:Connect(function()
copyLink(link, doneMessage)
end)
end
contactCard(38, "D", THEME.discord, "Discord", "Join the community server", CONFIG.Discord, "Discord link copied")
contactCard(108, "W", THEME.whatsapp, "WhatsApp", "Follow the channel", CONFIG.WhatsApp, "WhatsApp link copied")
contactCard(178, "T", THEME.tiktok, "TikTok", "Follow my account", CONFIG.TikTok, "TikTok link copied")
for index, pass in ipairs(CONFIG.SupportPasses or {}) do
local supportButton = makeButton(aboutRight, {
Text = "Support  " .. tostring(pass.amount) .. " R$",
Position = UDim2.fromOffset(16 + (index - 1) * 160, 256),
Size = UDim2.fromOffset(144, 34),
TextSize = 15,
Font = Enum.Font.GothamBlack,
TextColor3 = THEME.dark,
}, { fill = THEME.accent, hover = THEME.accentSoft, stroke = THEME.accentSoft, strokeTransparency = 0.5, radius = 10 })
supportButton.Activated:Connect(function()
copyLink("https://www.roblox.com/game-pass/" .. tostring(pass.id), "Support link copied (" .. tostring(pass.amount) .. " R$)")
end)
end
textLabel(aboutRight, "Tap a card or a Support button to copy its link, then paste it in your browser.", {
Position = UDim2.fromOffset(16, 298),
Size = UDim2.new(1, -32, 0, 22),
TextSize = 13,
TextColor3 = THEME.muted,
TextWrapped = true,
})
textLabel(aboutRight, "Made by " .. CONFIG.Creator .. "  |  " .. CONFIG.Community, {
AnchorPoint = Vector2.new(0, 1),
Position = UDim2.new(0, 16, 1, -12),
Size = UDim2.new(1, -32, 0, 16),
Font = Enum.Font.GothamBold,
TextSize = 14,
TextColor3 = THEME.accent,
})
task.spawn(function()
local image = nil
if CONFIG.AvatarImageUrl ~= "" and hasFS and type(getcustomasset) == "function" then
local ok, result = pcall(function()
local data = game:HttpGet(CONFIG.AvatarImageUrl)
writefile("DZHUP_avatar.png", data)
return getcustomasset("DZHUP_avatar.png")
end)
if ok and result then
image = result
end
end
if not image then
local userId = CONFIG.AvatarRobloxUserId
if (not userId or userId <= 0) and CONFIG.RobloxUsername and CONFIG.RobloxUsername ~= "" then
local ok, id = pcall(function()
return Players:GetUserIdFromNameAsync(CONFIG.RobloxUsername)
end)
if ok and type(id) == "number" then
userId = id
end
end
if userId and userId > 0 then
local ok, thumb, ready = pcall(function()
return Players:GetUserThumbnailAsync(
userId,
Enum.ThumbnailType.HeadShot,
Enum.ThumbnailSize.Size150x150
)
end)
if ok and thumb and thumb ~= "" and ready ~= false then
image = thumb
else
image = string.format("rbxthumb://type=AvatarHeadShot&id=%d&w=150&h=150", userId)
end
end
end
if image then
avatarImage.Image = image
avatarImage.Visible = true
avatarLetter.Visible = false
end
end)
end -- BLOCK creator
do -- BLOCK world
local card = new("Frame", {
Size = UDim2.fromOffset(588, 356),
BackgroundColor3 = THEME.surface,
BorderSizePixel = 0,
}, worldPage)
corner(card, 12)
stroke(card, THEME.line, 0.5, 1)
sectionTitle(card, "TIME OF DAY", 12)
local clockLabel = textLabel(card, "12:00", {
Position = UDim2.fromOffset(16, 10),
Size = UDim2.new(1, -32, 0, 20),
Font = Enum.Font.GothamBlack,
TextSize = 18,
TextColor3 = THEME.accent,
TextXAlignment = Enum.TextXAlignment.Right,
})
local PRESETS = { { "Dawn", 6 }, { "Day", 12 }, { "Sunset", 18 }, { "Night", 0 } }
local presetRow = new("Frame", {
Position = UDim2.fromOffset(16, 40),
Size = UDim2.new(1, -32, 0, 34),
BackgroundTransparency = 1,
}, card)
new("UIListLayout", {
FillDirection = Enum.FillDirection.Horizontal,
Padding = UDim.new(0, 8),
SortOrder = Enum.SortOrder.LayoutOrder,
}, presetRow)
local presetButtons = {}
local hour = 12
local function lighting()
return game:GetService("Lighting")
end
pcall(function()
hour = lighting().ClockTime
end)
local knob = nil
local function render()
clockLabel.Text = string.format("%02d:%02d", math.floor(hour) % 24, math.floor((hour % 1) * 60))
if knob then
knob.Position = UDim2.new(math.clamp(hour / 24, 0, 1), 0, 0.5, 0)
end
for _, item in ipairs(presetButtons) do
local active = math.abs(hour - item.hour) < 0.05
item.button.BackgroundColor3 = active and THEME.accent or THEME.surface2
item.button.TextColor3 = active and THEME.dark or THEME.text
end
end
local function setHour(value, commit)
hour = math.clamp(value, 0, 24)
pcall(function()
lighting().ClockTime = hour
end)
render()
if commit then
if type(save.settings.clock) ~= "table" then
save.settings.clock = {}
end
save.settings.clock[placeKey] = hour
persist()
end
end
for index, item in ipairs(PRESETS) do
local button = new("TextButton", {
Text = item[1],
Size = UDim2.fromOffset(126, 34),
TextSize = 15,
Font = Enum.Font.GothamBold,
TextColor3 = THEME.text,
BackgroundColor3 = THEME.surface2,
AutoButtonColor = false,
BorderSizePixel = 0,
LayoutOrder = index,
}, presetRow)
corner(button, 8)
stroke(button, THEME.line, 0.4, 1)
table.insert(presetButtons, { button = button, hour = item[2] })
button.Activated:Connect(function()
setHour(item[2], true)
end)
end
sectionTitle(card, "EXACT HOUR (drag)", 94)
local hit = new("Frame", {
Position = UDim2.fromOffset(16, 118),
Size = UDim2.new(1, -32, 0, 40),
BackgroundTransparency = 1,
Active = true,
}, card)
local bar = new("Frame", {
AnchorPoint = Vector2.new(0, 0.5),
Position = UDim2.new(0, 0, 0.5, 0),
Size = UDim2.new(1, 0, 0, 12),
BackgroundColor3 = Color3.new(1, 1, 1),
BorderSizePixel = 0,
}, hit)
corner(bar, 6)
new("UIGradient", {
Color = ColorSequence.new({
ColorSequenceKeypoint.new(0, Color3.fromRGB(15, 18, 45)),
ColorSequenceKeypoint.new(0.25, Color3.fromRGB(255, 170, 110)),
ColorSequenceKeypoint.new(0.5, Color3.fromRGB(120, 200, 255)),
ColorSequenceKeypoint.new(0.75, Color3.fromRGB(255, 120, 80)),
ColorSequenceKeypoint.new(1, Color3.fromRGB(15, 18, 45)),
}),
}, bar)
knob = new("Frame", {
AnchorPoint = Vector2.new(0.5, 0.5),
Position = UDim2.new(0.5, 0, 0.5, 0),
Size = UDim2.fromOffset(24, 24),
BackgroundColor3 = THEME.accent,
BorderSizePixel = 0,
ZIndex = 3,
}, hit)
corner(knob, 12)
stroke(knob, THEME.text, 0.3, 2)
textLabel(card, "00", { Position = UDim2.fromOffset(16, 162), Size = UDim2.fromOffset(40, 14), TextSize = 13, TextColor3 = THEME.muted })
textLabel(card, "12", { AnchorPoint = Vector2.new(0.5, 0), Position = UDim2.new(0.5, 0, 0, 162), Size = UDim2.fromOffset(40, 14), TextSize = 13, TextColor3 = THEME.muted, TextXAlignment = Enum.TextXAlignment.Center })
textLabel(card, "24", { AnchorPoint = Vector2.new(1, 0), Position = UDim2.new(1, -16, 0, 162), Size = UDim2.fromOffset(40, 14), TextSize = 13, TextColor3 = THEME.muted, TextXAlignment = Enum.TextXAlignment.Right })
textLabel(card, "The time is applied to the sky of your project and is saved with it. Save the project after changing it.", {
Position = UDim2.fromOffset(16, 196),
Size = UDim2.new(1, -32, 0, 34),
TextSize = 14,
TextColor3 = THEME.muted,
TextWrapped = true,
TextYAlignment = Enum.TextYAlignment.Top,
})
local sliding = false
local function pointer(input)
return input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch
end
local function fromInput(input)
local width = math.max(bar.AbsoluteSize.X, 1)
local rel = (input.Position.X - bar.AbsolutePosition.X) / width
setHour(math.clamp(rel, 0, 1) * 24, false)
end
hit.InputBegan:Connect(function(input)
if pointer(input) then
sliding = true
fromInput(input)
end
end)
on(UserInputService.InputChanged, function(input)
if sliding and (input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch) then
fromInput(input)
end
end)
on(UserInputService.InputEnded, function(input)
if sliding and pointer(input) then
sliding = false
setHour(hour, true)
end
end)
function H.applyClock()
local list = save.settings.clock
local saved = type(list) == "table" and list[placeKey] or nil
if type(saved) == "number" then
hour = saved
pcall(function()
lighting().ClockTime = hour
end)
else
pcall(function()
hour = lighting().ClockTime
end)
end
render()
end
render()
end -- BLOCK world
H.registerModule({
key = "toolbox",
title = "Toolbox",
order = 20,
build = function(page, ctx)
local new, corner, stroke, tween = ctx.new, ctx.corner, ctx.stroke, ctx.tween
local textLabel, makeButton, THEME = ctx.textLabel, ctx.makeButton, ctx.THEME
local toast, trim, persist = ctx.toast, ctx.trim, ctx.persist
local copyText, genv = ctx.copyText, ctx.genv
local HttpService = game:GetService("HttpService")
local BASE = "https://apis.roblox.com/toolbox-service/v1/"
local UID_ATTR = "DZ_TB_UID"
local PLACE_DISTANCE = 22
local CATS = {
{ key = "Models", title = "Models", typeId = 10 },
{ key = "Decals", title = "Decals", typeId = 13 },
{ key = "Meshes", title = "Meshes", typeId = 4 },
{ key = "Audio", title = "Audio", typeId = 3 },
{ key = "Animations", title = "Anims", typeId = 24 },
{ key = "Plugins", title = "Plugins", typeId = 38 },
{ key = "Favorites", title = "Favorites", kind = "fav" },
{ key = "MyIds", title = "My IDs", kind = "mine" },
{ key = "Placed", title = "Placed", kind = "placed" },
}
local SORTS = {
{ "Relevance", 1 },
{ "Most used", 2 },
{ "Favorited", 3 },
{ "Newest", 4 },
{ "Top rated", 5 },
}
local ID_TYPES = {
{ "Auto", "auto" },
{ "Model", 10 },
{ "Decal", 13 },
{ "Mesh", 4 },
{ "Audio", 3 },
{ "Anim", 24 },
{ "Sky", "sky" },
{ "Plugin", 38 },
}
local TYPE_MAP = { [1] = 13, [3] = 3, [4] = 4, [10] = 10, [13] = 13, [24] = 24, [32] = 10, [38] = 38 }
local TYPE_NAMES = { [10] = "Model", [13] = "Decal", [4] = "Mesh", [3] = "Audio", [24] = "Animation", [38] = "Plugin", sky = "Sky" }
local ANCHOR_CYCLE = { none = "all", all = "auto", auto = "none" }
local ANCHOR_TEXT = { none = "Off", all = "All", auto = "Smart" }
local MECH = {
VehicleSeat = true, HingeConstraint = true, CylindricalConstraint = true, SpringConstraint = true,
PrismaticConstraint = true,
}
local DEFAULTS = {
"4926139544|Part Trampoline", "11324928349|Lamp", "120813293048698|Podium",
"94304441802173|Village Low Poly", "131232802624216|Text", "5526968660|Pilar Bunga",
"574502744|Jembatan", "136224194594300|Part Bulet Biru", "91824881894906|Pilar Biru",
"18385401040|Jamur 1", "5465044187|Jamur 2", "5465008653|Jamur 3", "14405338498|Pohon Biru",
"101093196873917|Pilar Putih", "13717277279|Pagar", "108969178728061|Coil Mount Luna",
"71816321170147|Fitur P Balap", "94599287071471|Ayunan Pink", "99774552211130|Lampion",
"103932300220382|Efek Angin", "130556119417198|Efek Hujan", "107568096083006|Pulau Terapung",
"78758196076694|Kerambit Coil", "16491763998|Text 3D", "5539708469|Pohon Hijau",
"4987585723|Pagar Kayu", "83282010441336|Pohon Estetik", "10936331751|Kursi Raja",
"117717806718562|Pohon Ungu", "16444908253|Waterfall", "18849541324|Logo Mount Neon",
"77237492468310|Rintangan Nexora Full", "104719917463159|Tangga Mesh", "134505370549170|Rintangan Donat",
}
local st = ctx.store("toolboxV2")
if type(st.fav) ~= "table" then
st.fav = {}
end
if type(st.opts) ~= "table" then
st.opts = {}
end
if type(st.placed) ~= "table" then
st.placed = {}
end
if type(st.mine) ~= "table" then
st.mine = {}
for _, line in ipairs(DEFAULTS) do
local id, name = string.match(line, "^(%d+)|(.+)$")
if id then
table.insert(st.mine, { id = id, name = name, typeId = 10, creator = "My IDs" })
end
end
local old = ctx.save.settings.toolbox
if type(old) == "table" and type(old.custom) == "table" then
for _, entry in ipairs(old.custom) do
table.insert(st.mine, {
id = tostring(entry.id),
name = tostring(entry.name),
typeId = entry.category == "Sky" and "sky" or 10,
creator = "My IDs",
})
end
end
persist()
end
local opts = st.opts
-- v19: items are inserted exactly like the real Toolbox (nothing is changed) unless you turn an option on
if opts.v20 ~= true then
opts.v20 = true
opts.v19 = true
opts.anchorMode = "none"
opts.safeMode = false
opts.stripScripts = false
end
if opts.restore == nil then
opts.restore = true
end
local catIndex, sortIndex, idTypeIndex = 1, 1, 1
local keyword = ""
local items, cursor = {}, nil
local loading, loadError = false, nil
local requestToken = 0
local loadedOnce = false
local history = {}
local restoring = false
local sentinel = ctx.sentinel()
local render, refresh, paintChips
local detailItem = nil
local openDetail
local function svc(name)
return game:GetService(name)
end
local function containers()
local list = { svc("Workspace"), svc("Lighting"), svc("ServerScriptService"), svc("ReplicatedStorage"), svc("StarterGui"), svc("StarterPack"), svc("SoundService") }
pcall(function()
local starter = svc("StarterPlayer")
for _, name in ipairs({ "StarterPlayerScripts", "StarterCharacterScripts" }) do
local child = starter:FindFirstChild(name)
if child then
table.insert(list, child)
end
end
end)
return list
end
local function buildIndex()
local index = {}
for _, parent in ipairs(containers()) do
local ok, children = pcall(function()
return parent:GetChildren()
end)
if ok then
for _, child in ipairs(children) do
local uid = child:GetAttribute(UID_ATTR)
if uid then
index[uid] = index[uid] or {}
table.insert(index[uid], child)
end
end
end
end
return index
end
local function findAll(uid)
return buildIndex()[uid] or {}
end
local function findByUid(uid)
return findAll(uid)[1]
end
local function records()
local key = ctx.placeKey()
local list = st.placed[key]
if type(list) ~= "table" then
list = {}
st.placed[key] = list
end
return list
end
local function newUid()
return string.sub(string.gsub(HttpService:GenerateGUID(false), "-", ""), 1, 12)
end
local function removeRecord(rec)
for _, inst in ipairs(findAll(rec.uid)) do
pcall(function()
inst:Destroy()
end)
end
local list = records()
for i, item in ipairs(list) do
if item == rec or item.uid == rec.uid then
table.remove(list, i)
break
end
end
end
pcall(function()
local ws = svc("Workspace")
local old = ws:FindFirstChild("DZHUP_Toolbox")
if old and old:IsA("Folder") then
for _, child in ipairs(old:GetChildren()) do
child.Parent = ws
end
old:Destroy()
end
end)
local function httpGet(url)
local lastError = "no http function"
local req = genv.request or genv.http_request or (type(genv.syn) == "table" and genv.syn.request) or nil
if type(req) == "function" then
local ok, response = pcall(req, { Url = url, Method = "GET", Headers = { Accept = "application/json" } })
if ok and type(response) == "table" and type(response.Body) == "string" and #response.Body > 0 then
if response.StatusCode == nil or response.StatusCode == 200 then
return response.Body
end
lastError = "HTTP " .. tostring(response.StatusCode)
else
lastError = tostring(response)
end
end
local ok, body = pcall(function()
return game:HttpGet(url)
end)
if ok and type(body) == "string" and #body > 0 then
return body
end
local ok2, body2 = pcall(function()
return HttpService:GetAsync(url)
end)
if ok2 and type(body2) == "string" and #body2 > 0 then
return body2
end
return nil, lastError
end
local function getJson(url)
local body, err = httpGet(url)
if not body then
return nil, err
end
local ok, decoded = pcall(function()
return HttpService:JSONDecode(body)
end)
if ok and type(decoded) == "table" then
return decoded
end
return nil, "bad response"
end
local function fetchStore(cat, token)
local url = BASE .. "marketplace/" .. cat.typeId .. "?limit=30&pageNumber=0&sortType=" .. SORTS[sortIndex][2]
if keyword ~= "" then
url = url .. "&keyword=" .. HttpService:UrlEncode(keyword)
end
if cursor and cursor ~= "" then
url = url .. "&cursor=" .. HttpService:UrlEncode(cursor)
end
local data, err = getJson(url)
if token ~= requestToken then
return
end
if not data then
loading = false
loadError = "Could not reach the store (" .. tostring(err) .. ")"
render()
return
end
local ids = {}
for _, entry in ipairs(data.data or {}) do
local id = type(entry) == "table" and entry.id or entry
if tonumber(id) then
table.insert(ids, tostring(math.floor(tonumber(id))))
end
end
cursor = data.nextPageCursor
local details = {}
if #ids > 0 then
local info = getJson(BASE .. "items/details?assetIds=" .. table.concat(ids, ","))
if info then
for _, entry in ipairs(info.data or {}) do
local asset = entry.asset or entry
if asset.id then
details[tostring(math.floor(tonumber(asset.id) or 0))] = {
name = asset.name,
creator = entry.creator and entry.creator.name or nil,
desc = asset.description,
}
end
end
end
end
if token ~= requestToken then
return
end
for _, id in ipairs(ids) do
local d = details[id] or {}
table.insert(items, {
id = id,
name = tostring(d.name or ("Asset " .. id)),
typeId = cat.typeId,
creator = d.creator or "",
desc = d.desc and tostring(d.desc) or "",
})
end
loading = false
if #ids == 0 then
cursor = nil
end
render()
end
refresh = function(reset)
local cat = CATS[catIndex]
if not cat.typeId then
render()
return
end
requestToken += 1
local token = requestToken
if reset then
items = {}
cursor = nil
end
loading = true
loadError = nil
render()
task.spawn(function()
local ok, err = pcall(fetchStore, cat, token)
if not ok and token == requestToken then
loading = false
loadError = tostring(err)
render()
end
end)
end
local function spawnPoint()
local position, _, forward = ctx.viewBasis()
local anchor = ctx.findSpawn()
local target = position + forward * PLACE_DISTANCE
local hit = nil
pcall(function()
local params = RaycastParams.new()
params.FilterType = Enum.RaycastFilterType.Exclude
local ignore = {}
local localPlayer = game:GetService("Players").LocalPlayer
if localPlayer and localPlayer.Character then
table.insert(ignore, localPlayer.Character)
end
params.FilterDescendantsInstances = ignore
local startY = math.max(position.Y, anchor.Y) + 60
hit = svc("Workspace"):Raycast(Vector3.new(target.X, startY, target.Z), Vector3.new(0, -800, 0), params)
end)
if hit then
return hit.Position
end
return Vector3.new(target.X, anchor.Y, target.Z)
end
local function loadAsset(assetId)
for _ = 1, 3 do
local list = nil
pcall(function()
local container = game:GetService("InsertService"):LoadAsset(assetId)
list = container:GetChildren()
for _, object in ipairs(list) do
object.Parent = nil
end
container:Destroy()
end)
if list and #list > 0 then
return list
end
local ok, objects = pcall(function()
return game:GetObjects("rbxassetid://" .. tostring(assetId))
end)
if ok and type(objects) == "table" and #objects > 0 then
return objects
end
task.wait(0.5)
end
return nil
end
local function cfFromRecord(rec)
if type(rec.cf) == "table" and #rec.cf >= 12 then
local ok, cf = pcall(function()
return CFrame.new(table.unpack(rec.cf, 1, 12))
end)
if ok then
return cf
end
end
return nil
end
local function makeSaveable(root)
pcall(function()
root.Archivable = true
end)
for _, item in ipairs(root:GetDescendants()) do
pcall(function()
item.Archivable = true
end)
end
end
function H.lowestBottom(root)
local low = nil
local list = root:GetDescendants()
table.insert(list, root)
for _, d in ipairs(list) do
if d:IsA("BasePart") and d.Transparency < 0.95 then
local cf, sz = d.CFrame, d.Size
local ext = (math.abs(cf.RightVector.Y) * sz.X + math.abs(cf.UpVector.Y) * sz.Y + math.abs(cf.LookVector.Y) * sz.Z) / 2
local bottom = cf.Position.Y - ext
if not low or bottom < low then
low = bottom
end
end
end
return low
end
-- Moves the loaded roots only (position). Nothing else is changed, like the real Toolbox.
local function placeRoots(roots, cf)
local first = roots[1]
if cf then
pcall(function()
local delta = cf * first:GetPivot():Inverse()
for _, r in ipairs(roots) do
r:PivotTo(delta * r:GetPivot())
end
end)
else
local point = spawnPoint()
pcall(function()
local sumX, sumZ, low = 0, 0, nil
for _, r in ipairs(roots) do
local center = r:IsA("Model") and (r:GetBoundingBox()) or r.CFrame
sumX += center.Position.X
sumZ += center.Position.Z
local bottom = H.lowestBottom(r)
if bottom and (not low or bottom < low) then
low = bottom
end
end
local n = #roots
low = low or (first:GetPivot().Position.Y - 2)
local shift = Vector3.new(point.X - sumX / n, (point.Y + 0.1) - low, point.Z - sumZ / n)
for _, r in ipairs(roots) do
r:PivotTo(r:GetPivot() + shift)
end
end)
end
for _, r in ipairs(roots) do
r.Parent = svc("Workspace")
makeSaveable(r)
end
end
local function tag(root, rec)
pcall(function()
root:SetAttribute(UID_ATTR, rec.uid)
root:SetAttribute("DZ_TB_ASSET", tostring(rec.id))
end)
end
local function routeTarget(object)
local function pick(parent, label)
if parent then
return parent, label
end
return nil
end
if object:IsA("LocalScript") then
local starter = svc("StarterPlayer")
return pick(starter:FindFirstChild("StarterPlayerScripts"), "StarterPlayerScripts")
elseif object:IsA("Script") then
local context = nil
pcall(function()
context = object.RunContext
end)
if context == Enum.RunContext.Client then
return svc("ReplicatedStorage"), "ReplicatedStorage"
end
return svc("ServerScriptService"), "ServerScriptService"
elseif object:IsA("ModuleScript") then
return svc("ReplicatedStorage"), "ReplicatedStorage"
elseif object:IsA("ScreenGui") then
return svc("StarterGui"), "StarterGui"
elseif object:IsA("Tool") or object:IsA("HopperBin") then
return svc("StarterPack"), "StarterPack"
elseif object:IsA("Sky") or object:IsA("Atmosphere") or object:IsA("Clouds") or object:IsA("PostEffect") then
if object:IsA("Sky") then
for _, child in ipairs(svc("Lighting"):GetChildren()) do
if child:IsA("Sky") then
child:Destroy()
end
end
end
return svc("Lighting"), "Lighting"
end
return nil
end
-- Safe mode helpers (OFF by default): only used when you turn "Safe" on
function H.isBadScript(object)
if not object:IsA("LuaSourceContainer") then
return false
end
local name = object.Name
if #name >= 10 and string.match(name, "^%a+$") then
local switches = 0
for i = 2, #name do
local a, b = string.sub(name, i - 1, i - 1), string.sub(name, i, i)
if string.match(a, "%l") and string.match(b, "%u") then
switches += 1
end
end
if switches >= 5 and switches / #name >= 0.25 then
return true
end
end
return false
end
function H.cleanScripts(root)
local removed = 0
for _, item in ipairs(root:GetDescendants()) do
if H.isBadScript(item) then
removed += 1
pcall(function()
item:Destroy()
end)
end
end
return removed
end
function H.cleanSounds(root)
task.spawn(function()
local sounds = {}
for _, item in ipairs(root:GetDescendants()) do
if item:IsA("Sound") and item.SoundId ~= "" then
table.insert(sounds, item)
end
end
if #sounds == 0 then
return
end
local failed = {}
pcall(function()
game:GetService("ContentProvider"):PreloadAsync(sounds, function(contentId, status)
if status ~= Enum.AssetFetchStatus.Success then
failed[tostring(contentId)] = true
end
end)
end)
for _, sound in ipairs(sounds) do
if sound.Parent and failed[sound.SoundId] then
pcall(function()
sound:Destroy()
end)
end
end
end)
end
-- Background preload only: it never waits and never changes anything
function H.softPreload(roots)
task.spawn(function()
local list = {}
for _, r in ipairs(roots) do
local all = r:GetDescendants()
table.insert(all, r)
for _, d in ipairs(all) do
if d:IsA("MeshPart") or d:IsA("SpecialMesh") or d:IsA("Decal") or d:IsA("Texture") or d:IsA("SurfaceAppearance") then
table.insert(list, d)
end
end
end
if #list > 0 then
pcall(function()
game:GetService("ContentProvider"):PreloadAsync(list)
end)
end
end)
end
-- v20: the store file is downloaded and the CODE of every script is read from it,
-- so models arrive complete (cars, doors...) and not as empty shells.
local appliedSource = setmetatable({}, { __mode = "k" })
local function u32(s, p)
local a, b, c, d = string.byte(s, p, p + 3)
return a + b * 256 + c * 65536 + d * 16777216
end
local function lz4(src, pos, compLen)
local out, op = {}, 0
local ip, iend = pos, pos + compLen
local guard = 0
while ip < iend do
local token = string.byte(src, ip)
ip += 1
local lit = bit32.rshift(token, 4)
if lit == 15 then
local b
repeat
b = string.byte(src, ip)
ip += 1
lit += b
until b ~= 255
end
for i = 0, lit - 1 do
out[op + 1 + i] = string.byte(src, ip + i)
end
op += lit
ip += lit
if ip >= iend then
break
end
local offset = string.byte(src, ip) + string.byte(src, ip + 1) * 256
ip += 2
local ml = bit32.band(token, 15)
if ml == 15 then
local b
repeat
b = string.byte(src, ip)
ip += 1
ml += b
until b ~= 255
end
ml += 4
local from = op - offset
for i = 1, ml do
out[op + i] = out[from + i]
end
op += ml
guard += 1
if guard % 3000 == 0 then
task.wait()
end
end
local parts = {}
for i = 1, op, 4096 do
local j = math.min(i + 4095, op)
parts[#parts + 1] = string.char(table.unpack(out, i, j))
end
return table.concat(parts)
end
local function readInts(s, pos, n)
local vals = {}
for i = 0, n - 1 do
local b0 = string.byte(s, pos + i)
local b1 = string.byte(s, pos + n + i)
local b2 = string.byte(s, pos + n * 2 + i)
local b3 = string.byte(s, pos + n * 3 + i)
local v = b0 * 16777216 + b1 * 65536 + b2 * 256 + b3
if v % 2 == 0 then
v = v / 2
else
v = -((v + 1) / 2)
end
vals[i + 1] = v
end
return vals, pos + n * 4
end
local function accumulate(vals)
local acc = 0
for i, v in ipairs(vals) do
acc += v
vals[i] = acc
end
return vals
end
local function parseRbxm(data)
if string.sub(data, 1, 8) ~= "<roblox!" then
return nil, "not a binary model"
end
local pos = 33
local classes, insts, roots = {}, {}, {}
while pos + 15 <= #data do
local cname4 = string.sub(data, pos, pos + 3)
local compLen = u32(data, pos + 4)
local rawLen = u32(data, pos + 8)
local dpos = pos + 16
local chunk
if compLen == 0 then
chunk = string.sub(data, dpos, dpos + rawLen - 1)
pos = dpos + rawLen
else
chunk = lz4(data, dpos, compLen)
pos = dpos + compLen
end
if string.sub(cname4, 1, 3) == "END" then
break
end
if cname4 == "INST" then
local classId = u32(chunk, 1)
local nlen = u32(chunk, 5)
local className = string.sub(chunk, 9, 8 + nlen)
local p = 9 + nlen
local count = u32(chunk, p + 1)
local refs = accumulate((readInts(chunk, p + 5, count)))
classes[classId] = { refs = refs }
for _, r in ipairs(refs) do
insts[r] = { class = className, children = {} }
end
elseif cname4 == "PROP" then
local classId = u32(chunk, 1)
local plen = u32(chunk, 5)
local pname = string.sub(chunk, 9, 8 + plen)
local p = 9 + plen
local ptype = string.byte(chunk, p)
p += 1
local cls = classes[classId]
if cls and ptype == 1 and (pname == "Name" or pname == "Source") then
for _, r in ipairs(cls.refs) do
local len = u32(chunk, p)
local str = string.sub(chunk, p + 4, p + 3 + len)
p += 4 + len
if insts[r] then
if pname == "Name" then
insts[r].name = str
else
insts[r].source = str
end
end
end
end
elseif cname4 == "PRNT" then
local count = u32(chunk, 2)
local kids, nextPos = readInts(chunk, 6, count)
accumulate(kids)
local pars = accumulate((readInts(chunk, nextPos, count)))
for i = 1, count do
local child, parent = kids[i], pars[i]
if parent == -1 then
roots[#roots + 1] = child
elseif insts[parent] then
table.insert(insts[parent].children, child)
end
end
end
end
local out = {}
local function walk(list, parentKey)
local counters = {}
for _, r in ipairs(list) do
local inst = insts[r]
if inst then
local base = inst.class .. ":" .. tostring(inst.name or inst.class)
counters[base] = (counters[base] or 0) + 1
local key = parentKey .. "/" .. base .. "#" .. counters[base]
if inst.source and inst.source ~= "" then
out[key] = inst.source
end
walk(inst.children, key)
end
end
end
walk(roots, "")
return out
end
local function fetchRaw(url)
local ok, body = pcall(function()
return game:HttpGet(url)
end)
if ok and type(body) == "string" and #body > 40 then
return body
end
for _, key in ipairs({ "request", "http_request" }) do
local fn = genv[key] or _G[key]
if type(fn) == "function" then
local ok2, resp = pcall(fn, { Url = url, Method = "GET" })
if ok2 and type(resp) == "table" and type(resp.Body) == "string" and #resp.Body > 40 and (resp.StatusCode == nil or resp.StatusCode == 200) then
return resp.Body
end
end
end
if type(genv.syn) == "table" and type(genv.syn.request) == "function" then
local ok3, resp = pcall(genv.syn.request, { Url = url, Method = "GET" })
if ok3 and type(resp) == "table" and type(resp.Body) == "string" and #resp.Body > 40 then
return resp.Body
end
end
return nil
end
local function downloadAsset(assetId)
for _, url in ipairs({
"https://assetdelivery.roblox.com/v1/asset/?id=" .. tostring(assetId),
"https://assetdelivery.roblox.com/v1/asset?id=" .. tostring(assetId),
}) do
local body = fetchRaw(url)
if body and string.sub(body, 1, 8) == "<roblox!" then
return body
end
end
local info = getJson("https://apis.roblox.com/asset-delivery-api/v1/assetId/" .. tostring(assetId))
if info and type(info.location) == "string" then
local body = fetchRaw(info.location)
if body and string.sub(body, 1, 8) == "<roblox!" then
return body
end
end
return nil
end
local function setSource(inst, src)
local methods = {
function()
inst.Source = src
end,
function()
setscriptable(inst, "Source", true)
inst.Source = src
end,
function()
sethiddenproperty(inst, "Source", src)
end,
}
for _, method in ipairs(methods) do
local ok = pcall(method)
if ok then
local readOk, back = pcall(function()
return inst.Source
end)
if not readOk or back == src or (type(back) == "string" and #back > 0) then
return true
end
end
end
return false
end
function H.applySources(objects, assetId)
local body = downloadAsset(assetId)
if not body then
return 0, 0, "the file could not be downloaded"
end
local ok, sources = pcall(parseRbxm, body)
if not ok or type(sources) ~= "table" then
return 0, 0, "the file could not be read"
end
local idx = {}
local function index(list, parentKey)
local counters = {}
for _, inst in ipairs(list) do
local base = inst.ClassName .. ":" .. inst.Name
counters[base] = (counters[base] or 0) + 1
local key = parentKey .. "/" .. base .. "#" .. counters[base]
idx[key] = inst
index(inst:GetChildren(), key)
end
end
index(objects, "")
for _, name in ipairs({ "setthreadidentity", "set_thread_identity", "setidentity", "set_identity", "setthreadcontext" }) do
local fn = genv[name] or _G[name]
if type(fn) == "function" and pcall(fn, 8) then
break
end
end
local good, bad, found = 0, 0, 0
local covered = {}
for key, src in pairs(sources) do
found += 1
local inst = idx[key]
if inst and inst:IsA("LuaSourceContainer") then
covered[inst] = true
if setSource(inst, src) then
good += 1
appliedSource[inst] = src
else
bad += 1
end
end
end
local fallback = 0
local decompileFn = genv.decompile or _G.decompile
if type(decompileFn) == "function" then
for _, inst in pairs(idx) do
if inst:IsA("LuaSourceContainer") and not covered[inst] then
local ok2, code = pcall(decompileFn, inst)
if ok2 and type(code) == "string" and #code > 20 and setSource(inst, code) then
fallback += 1
good += 1
appliedSource[inst] = code
end
end
end
end
warn("[DZHUP Toolbox] script code: " .. found .. " found in the file, " .. good .. " applied (" .. fallback .. " by decompile), " .. bad .. " failed")
if found == 0 and fallback == 0 then
return 0, 0, "the file contains no readable script code"
end
return good, bad
end
-- Looks for the script table that Studio Lite itself uses and registers the inserted scripts there
function H.registerScripts(roots)
local gc = genv.getgc or _G.getgc
if type(gc) ~= "function" then
return 0, "getgc is not available in this executor"
end
local scripts = {}
for _, r in ipairs(roots) do
if r:IsA("LuaSourceContainer") then
table.insert(scripts, r)
end
for _, d in ipairs(r:GetDescendants()) do
if d:IsA("LuaSourceContainer") then
table.insert(scripts, d)
end
end
end
if #scripts == 0 then
return 0
end
local ok, list = pcall(gc, true)
if not ok or type(list) ~= "table" then
return 0, "getgc failed"
end
local targets = {}
for _, tbl in ipairs(list) do
if type(tbl) == "table" and not rawequal(tbl, appliedSource) then
local instKeys, strKeys, total = 0, 0, 0
local sampleKey, sampleVal = nil, nil
pcall(function()
for k, v in pairs(tbl) do
total += 1
if total > 3000 then
break
end
if typeof(k) == "Instance" then
if k:IsA("LuaSourceContainer") and type(v) == "string" then
instKeys += 1
sampleKey, sampleVal = k, v
end
elseif type(k) == "string" and #k > 6 and type(v) == "string"
and (string.sub(k, 1, 12) == "ModuleScript" or string.sub(k, 1, 11) == "LocalScript" or string.sub(k, 1, 6) == "Script") then
strKeys += 1
sampleKey, sampleVal = k, v
end
end
end)
if instKeys > 0 or strKeys > 0 then
table.insert(targets, { tbl = tbl, inst = instKeys, str = strKeys, total = total, key = sampleKey })
end
end
end
warn("[DZHUP Toolbox] script registry scan: " .. #list .. " tables checked, " .. #targets .. " candidate(s)")
local written = 0
for index, target in ipairs(targets) do
if index <= 6 then
warn("[DZHUP Toolbox]   candidate " .. index .. ": " .. target.inst .. " script keys, " .. target.str .. " name keys, " .. target.total .. " entries, sample key = " .. tostring(target.key))
end
if index <= 3 then
for _, scriptObject in ipairs(scripts) do
local src = appliedSource[scriptObject]
if not src then
pcall(function()
src = scriptObject.Source
end)
end
if type(src) == "string" and src ~= "" then
local okSet = pcall(function()
if target.inst > 0 then
target.tbl[scriptObject] = src
end
if target.str > 0 then
target.tbl[scriptObject.ClassName .. scriptObject.Name] = src
end
end)
if okSet then
written += 1
end
end
end
end
end
if #targets == 0 then
return 0, "Studio Lite's script table was not found"
end
return written
end
-- Diagnosis: compares how Tune modules look and where they are referenced (native vs inserted here)
function H.diagnose()
local gc = genv.getgc or _G.getgc
local list = nil
if type(gc) == "function" then
local ok, res = pcall(gc, true)
if ok and type(res) == "table" then
list = res
end
end
local tunes = {}
for _, d in ipairs(svc("Workspace"):GetDescendants()) do
if d:IsA("LuaSourceContainer") and string.find(string.lower(d.Name), "tune", 1, true) then
table.insert(tunes, d)
end
end
warn("[DZ-DIAG] tune modules in Workspace: " .. #tunes .. " | getgc: " .. tostring(list ~= nil))
for _, T in ipairs(tunes) do
local attrs = {}
for k in pairs(T:GetAttributes()) do
table.insert(attrs, k)
end
local kids = {}
for _, c in ipairs(T:GetChildren()) do
table.insert(kids, c.ClassName .. ":" .. c.Name)
end
local srcLen = -1
pcall(function()
srcLen = #T.Source
end)
local mine = false
local a = T
while a and a ~= game do
if a:GetAttribute(UID_ATTR) then
mine = true
end
a = a.Parent
end
local parentName = T.Parent and T.Parent.Name or "nil"
warn("[DZ-DIAG] " .. (mine and "MINE" or "NATIVE") .. " | " .. T.ClassName .. " | parent=" .. parentName .. " | attrs=" .. table.concat(attrs, ",") .. " | kids=" .. table.concat(kids, ",") .. " | source=" .. srcLen)
if list then
local combo = T.ClassName .. T.Name
local found = 0
for _, tbl in ipairs(list) do
if type(tbl) == "table" and not rawequal(tbl, appliedSource) and not rawequal(tbl, list) then
local hit, total, keyType, valType = nil, 0, nil, nil
pcall(function()
for k, v in pairs(tbl) do
total += 1
if total > 3000 then
break
end
if k == T then
hit, keyType, valType = "key", typeof(k), typeof(v)
break
elseif v == T then
hit, keyType, valType = "value", typeof(k), typeof(v)
break
elseif type(k) == "string" and (k == combo or k == T.Name) then
hit, keyType, valType = "name key", typeof(k), typeof(v)
break
end
end
end)
if hit then
found += 1
if found <= 4 then
warn("[DZ-DIAG]    referenced as " .. hit .. " in a table of ~" .. total .. " entries (key " .. tostring(keyType) .. ", value " .. tostring(valType) .. ")")
end
end
end
end
if found == 0 then
warn("[DZ-DIAG]    not referenced by any table")
end
end
end
warn("[DZ-DIAG] done")
end
local function createItem(rec, restoringNow)
local assetId = tonumber(string.match(tostring(rec.id), "%d+"))
if not assetId then
return false, "Invalid asset id"
end
local t = rec.typeId
local texture = "rbxassetid://" .. tostring(assetId)
local workspaceService = svc("Workspace")
if t == "sky" then
local sky = nil
local ok = pcall(function()
local lighting = svc("Lighting")
for _, child in ipairs(lighting:GetChildren()) do
if child:IsA("Sky") then
child:Destroy()
end
end
sky = Instance.new("Sky")
sky.Name = "DZHUP_Sky"
sky.SkyboxBk, sky.SkyboxDn, sky.SkyboxFt = texture, texture, texture
sky.SkyboxLf, sky.SkyboxRt, sky.SkyboxUp = texture, texture, texture
sky.Parent = lighting
end)
if ok and sky then
tag(sky, rec)
return true, "Sky applied: " .. rec.name, sky
end
return false, "Could not apply the sky"
end
if t == 38 then
if not restoringNow then
copyText(tostring(assetId))
end
return true, "Plugin ID copied (install it from the Creator Store)", nil
end
if t == 24 then
local animation = Instance.new("Animation")
animation.Name = rec.name
animation.AnimationId = texture
animation.Parent = workspaceService
tag(animation, rec)
return true, "Animation added to Workspace: " .. rec.name, animation
end
if t == 3 then
local sound = Instance.new("Sound")
sound.Name = rec.name
sound.SoundId = texture
sound.Parent = workspaceService
tag(sound, rec)
return true, "Audio added to Workspace: " .. rec.name, sound
end
local cf = cfFromRecord(rec)
if t == 13 then
local part = Instance.new("Part")
part.Name = rec.name
part.Size = Vector3.new(6, 6, 0.4)
part.Anchored = true
part.Material = Enum.Material.SmoothPlastic
part.Color = Color3.new(1, 1, 1)
local decal = nil
local objects = loadAsset(assetId)
if objects then
for _, object in ipairs(objects) do
if object:IsA("Decal") then
decal = object
break
end
end
end
if not decal then
decal = Instance.new("Decal")
decal.Texture = texture
end
decal.Face = Enum.NormalId.Front
decal.Parent = part
if not cf then
part.Position = spawnPoint() + Vector3.new(0, 3, 0)
end
placeRoots({ part }, cf)
tag(part, rec)
return true, "Decal inserted: " .. rec.name, part
end
if t == 4 then
local mesh = nil
pcall(function()
mesh = game:GetService("InsertService"):CreateMeshPartAsync(
texture,
Enum.CollisionFidelity.Box,
Enum.RenderFidelity.Automatic
)
end)
if not mesh then
mesh = Instance.new("Part")
mesh.Size = Vector3.new(4, 4, 4)
local special = Instance.new("SpecialMesh")
special.MeshType = Enum.MeshType.FileMesh
special.MeshId = texture
special.Parent = mesh
end
mesh.Name = rec.name
mesh.Anchored = true
if not cf then
mesh.Position = spawnPoint() + Vector3.new(0, 3, 0)
end
placeRoots({ mesh }, cf)
tag(mesh, rec)
return true, "Mesh inserted: " .. rec.name, mesh
end
-- Models: loaded exactly like the real Toolbox does, then only moved in front of you
local objects = loadAsset(assetId)
if not objects then
return false, "Could not load asset " .. tostring(assetId) .. ". Check your internet and try again."
end
local srcGood, srcBad, srcNote = H.applySources(objects, assetId)
local safe = opts.safeMode == true
local hasSpatial = false
for _, object in ipairs(objects) do
if object:IsA("Model") or object:IsA("BasePart") then
hasSpatial = true
end
end
local roots, loose, routedNames = {}, {}, {}
local firstRouted = nil
local removedBad = 0
for _, object in ipairs(objects) do
if safe and H.isBadScript(object) then
removedBad += 1
pcall(function()
object:Destroy()
end)
else
local target, label = nil, nil
if not (hasSpatial and object:IsA("LuaSourceContainer")) then
target, label = routeTarget(object)
end
if target then
object.Parent = target
makeSaveable(object)
tag(object, rec)
if safe then
removedBad += H.cleanScripts(object)
H.cleanSounds(object)
end
firstRouted = firstRouted or object
table.insert(routedNames, object.Name .. " > " .. label)
elseif object:IsA("Model") or object:IsA("BasePart") then
table.insert(roots, object)
else
table.insert(loose, object)
end
end
end
if #roots == 0 then
for _, object in ipairs(loose) do
object.Parent = workspaceService
makeSaveable(object)
tag(object, rec)
firstRouted = firstRouted or object
end
if not firstRouted then
return false, "The asset is empty"
end
local text = #routedNames > 0 and table.concat(routedNames, ", ") or "Workspace"
return true, "Placed: " .. text, firstRouted
end
-- loose scripts that came with the model stay next to it (so cars and doors keep working)
for _, object in ipairs(loose) do
if roots[1]:IsA("Model") then
object.Parent = roots[1]
else
table.insert(roots, object)
end
end
local scriptCount, vehicle, mechanical = 0, false, false
for _, root in ipairs(roots) do
if root:IsA("LuaSourceContainer") then
scriptCount += 1
end
for _, descendant in ipairs(root:GetDescendants()) do
if descendant:IsA("LuaSourceContainer") then
scriptCount += 1
end
if descendant:IsA("VehicleSeat") then
vehicle = true
end
if MECH[descendant.ClassName] then
mechanical = true
end
end
end
if vehicle then
mechanical = true
end
if safe then
for _, root in ipairs(roots) do
removedBad += H.cleanScripts(root)
H.cleanSounds(root)
end
end
local removed = 0
if rec.strip == true and not vehicle then
for _, root in ipairs(roots) do
for _, descendant in ipairs(root:GetDescendants()) do
if descendant:IsA("LuaSourceContainer") then
removed += 1
pcall(function()
descendant:Destroy()
end)
end
end
end
end
local mode = rec.anchorMode or "none"
if mode == "all" or (mode == "auto" and not mechanical) then
for _, root in ipairs(roots) do
if root:IsA("BasePart") then
root.Anchored = true
end
for _, descendant in ipairs(root:GetDescendants()) do
if descendant:IsA("BasePart") then
descendant.Anchored = true
end
end
end
end
local spatialRoots = {}
for _, root in ipairs(roots) do
if root:IsA("Model") or root:IsA("BasePart") then
table.insert(spatialRoots, root)
end
end
placeRoots(spatialRoots, cf)
for _, root in ipairs(roots) do
if not root.Parent then
root.Parent = workspaceService
end
tag(root, rec)
end
H.softPreload(spatialRoots)
local regCount, regNote = H.registerScripts(spatialRoots)
local message = "Inserted: " .. rec.name
if vehicle then
message = message .. " (vehicle)"
end
if removed > 0 then
message = message .. " (" .. removed .. " scripts removed)"
elseif scriptCount > 0 then
message = message .. " (" .. scriptCount .. " scripts inside, kept)"
end
if scriptCount > 0 then
if srcGood > 0 then
message = message .. " (" .. srcGood .. " scripts loaded with their code)"
end
if srcBad > 0 then
message = message .. " (" .. srcBad .. " scripts could not receive their code)"
end
if srcGood == 0 and srcBad == 0 and srcNote then
message = message .. " (script code not read: " .. srcNote .. ")"
end
end
if regCount > 0 then
message = message .. " (registered " .. regCount .. " scripts in Studio Lite)"
elseif regNote and scriptCount > 0 then
message = message .. " (" .. regNote .. ")"
end
if removedBad > 0 then
message = message .. " (Safe: " .. removedBad .. " suspicious items removed)"
end
if #routedNames > 0 then
message = message .. " + " .. table.concat(routedNames, ", ")
end
return true, message, spatialRoots[1]
end
local function insertNew(item)
local rec = {
uid = newUid(),
id = tostring(item.id),
name = tostring(item.name),
typeId = item.typeId,
creator = tostring(item.creator or ""),
desc = tostring(item.desc or ""),
anchorMode = opts.anchorMode,
strip = opts.stripScripts == true,
}
local ok, message, root = createItem(rec, false)
if ok and root then
pcall(function()
rec.cf = { root:GetPivot():GetComponents() }
end)
table.insert(records(), rec)
table.insert(history, rec.uid)
persist()
end
return ok, message
end
local function restoreAll(force)
if restoring or (opts.restore == false and not force) then
return 0
end
restoring = true
local count = 0
local index = buildIndex()
for _, rec in ipairs(table.clone(records())) do
if rec.typeId ~= 38 and not index[rec.uid] then
local ok, success = pcall(createItem, rec, true)
if ok and success then
count += 1
end
task.wait(0.05)
end
end
restoring = false
return count
end
-- Reads name / creator / type of any asset id from the store
local function resolveItem(id)
local item = { id = id, name = "Asset " .. id, typeId = 10, creator = "", desc = "" }
local info = getJson(BASE .. "items/details?assetIds=" .. id)
local entry = info and info.data and info.data[1]
if entry then
local asset = entry.asset or entry
if asset.name then
item.name = tostring(asset.name)
end
if entry.creator and entry.creator.name then
item.creator = tostring(entry.creator.name)
end
if asset.description then
item.desc = tostring(asset.description)
end
local tid = tonumber(asset.typeId or asset.assetTypeId)
if tid then
item.typeId = TYPE_MAP[tid] or 10
end
end
local choice = ID_TYPES[idTypeIndex][2]
if choice ~= "auto" then
item.typeId = choice
end
return item
end
local function field(parent, x, y, w, h, placeholder)
local box = new("TextBox", {
Position = UDim2.fromOffset(x, y),
Size = UDim2.fromOffset(w, h),
BackgroundColor3 = THEME.field,
BorderSizePixel = 0,
ClearTextOnFocus = false,
PlaceholderText = placeholder,
PlaceholderColor3 = THEME.muted,
Text = "",
TextColor3 = THEME.text,
TextSize = 14,
Font = Enum.Font.GothamBold,
TextXAlignment = Enum.TextXAlignment.Left,
TextTruncate = Enum.TextTruncate.AtEnd,
}, parent)
corner(box, 9)
new("UIPadding", { PaddingLeft = UDim.new(0, 10), PaddingRight = UDim.new(0, 10) }, box)
local boxStroke = stroke(box, THEME.line, 0.35, 1)
box.Focused:Connect(function()
tween(boxStroke, 0.18, { Color = THEME.accent, Transparency = 0 })
end)
box.FocusLost:Connect(function()
tween(boxStroke, 0.18, { Color = THEME.line, Transparency = 0.35 })
end)
return box
end
local side = new("Frame", {
Size = UDim2.fromOffset(128, 392),
BackgroundColor3 = THEME.surface,
BorderSizePixel = 0,
}, page)
corner(side, 12)
stroke(side, THEME.line, 0.5, 1)
textLabel(side, "TOOLBOX", {
Position = UDim2.fromOffset(14, 10),
Size = UDim2.new(1, -28, 0, 14),
TextSize = 13,
Font = Enum.Font.GothamBlack,
TextColor3 = THEME.muted,
})
local diagButton = makeButton(side, {
Text = "Diag",
Position = UDim2.fromOffset(76, 6),
Size = UDim2.fromOffset(46, 22),
TextSize = 11,
}, { fill = THEME.surface2, radius = 7 })
diagButton.Activated:Connect(function()
toast("Diagnosis printed in Output", true)
task.spawn(H.diagnose)
end)
local sideList = new("ScrollingFrame", {
Position = UDim2.fromOffset(6, 30),
Size = UDim2.new(1, -12, 1, -36),
BackgroundTransparency = 1,
BorderSizePixel = 0,
ScrollBarThickness = 0,
CanvasSize = UDim2.new(),
AutomaticCanvasSize = Enum.AutomaticSize.Y,
ScrollingDirection = Enum.ScrollingDirection.Y,
}, side)
new("UIListLayout", { Padding = UDim.new(0, 3), SortOrder = Enum.SortOrder.LayoutOrder }, sideList)
local chips = {}
for index, cat in ipairs(CATS) do
if cat.key == "Favorites" then
new("Frame", {
Size = UDim2.new(1, -8, 0, 1),
BackgroundColor3 = THEME.line,
BackgroundTransparency = 0.3,
BorderSizePixel = 0,
LayoutOrder = index * 2 - 1,
}, sideList)
end
local button = new("TextButton", {
Text = "",
Size = UDim2.new(1, 0, 0, 32),
BackgroundColor3 = THEME.surface2,
BackgroundTransparency = 1,
AutoButtonColor = false,
BorderSizePixel = 0,
LayoutOrder = index * 2,
}, sideList)
corner(button, 8)
local bar = new("Frame", {
Position = UDim2.fromOffset(0, 6),
Size = UDim2.fromOffset(3, 16),
BackgroundColor3 = THEME.accent,
BorderSizePixel = 0,
Visible = false,
}, button)
corner(bar, 2)
local dot = new("Frame", {
Position = UDim2.fromOffset(10, 13),
Size = UDim2.fromOffset(6, 6),
BackgroundColor3 = ({ THEME.accent, THEME.success, THEME.discord, THEME.danger, THEME.tiktok, THEME.muted, THEME.accentSoft, THEME.whatsapp, THEME.text })[index] or THEME.accent,
BorderSizePixel = 0,
}, button)
corner(dot, 3)
local label = textLabel(button, cat.title, {
Position = UDim2.fromOffset(24, 0),
Size = UDim2.new(1, -50, 1, 0),
Font = Enum.Font.GothamBlack,
TextSize = 13,
TextTruncate = Enum.TextTruncate.AtEnd,
})
local badge = textLabel(button, "", {
AnchorPoint = Vector2.new(1, 0),
Position = UDim2.new(1, -8, 0, 0),
Size = UDim2.fromOffset(28, 28),
TextSize = 13,
TextColor3 = THEME.muted,
TextXAlignment = Enum.TextXAlignment.Right,
})
table.insert(chips, { button = button, bar = bar, label = label, badge = badge })
button.MouseEnter:Connect(function()
if catIndex ~= index then
tween(button, 0.1, { BackgroundTransparency = 0.6 })
end
end)
button.MouseLeave:Connect(function()
if catIndex ~= index then
tween(button, 0.1, { BackgroundTransparency = 1 })
end
end)
button.Activated:Connect(function()
catIndex = index
if detailItem then
detailItem = nil
end
if cat.typeId then
refresh(true)
else
render()
end
end)
end
local function countOf(tbl)
local n = 0
for _ in pairs(tbl) do
n += 1
end
return n
end
paintChips = function()
for i, chip in ipairs(chips) do
local active = i == catIndex
chip.button.BackgroundColor3 = THEME.surface2
tween(chip.button, 0.14, { BackgroundTransparency = active and 0 or 1 })
chip.bar.Visible = active
chip.label.TextColor3 = active and THEME.accent or THEME.text
local cat = CATS[i]
if cat.kind == "fav" then
chip.badge.Text = tostring(countOf(st.fav))
elseif cat.kind == "mine" then
chip.badge.Text = tostring(#st.mine)
elseif cat.kind == "placed" then
chip.badge.Text = tostring(#records())
end
end
end
local main = new("Frame", {
Position = UDim2.fromOffset(136, 0),
Size = UDim2.fromOffset(452, 392),
BackgroundTransparency = 1,
}, page)
local searchBox = field(main, 0, 0, 218, 34, "Search the store...")
local stamp = 0
searchBox:GetPropertyChangedSignal("Text"):Connect(function()
stamp += 1
local mine = stamp
task.delay(0.6, function()
if mine ~= stamp then
return
end
keyword = trim(searchBox.Text)
if CATS[catIndex].typeId then
refresh(true)
else
render()
end
end)
end)
local sortButton = makeButton(main, {
Text = SORTS[sortIndex][1],
Position = UDim2.fromOffset(224, 0),
Size = UDim2.fromOffset(96, 34),
TextSize = 15,
}, { fill = THEME.surface2, radius = 9 })
sortButton.Activated:Connect(function()
sortIndex = sortIndex % #SORTS + 1
sortButton.Text = SORTS[sortIndex][1]
if CATS[catIndex].typeId then
refresh(true)
end
end)
local undoButton = makeButton(main, {
Text = "Undo",
Position = UDim2.fromOffset(324, 0),
Size = UDim2.fromOffset(58, 34),
TextSize = 15,
TextColor3 = THEME.accent,
}, { fill = THEME.surface, stroke = THEME.accent, strokeTransparency = 0.6, radius = 9 })
undoButton.Activated:Connect(function()
while #history > 0 do
local uid = table.remove(history)
for _, rec in ipairs(records()) do
if rec.uid == uid then
local name = rec.name
removeRecord(rec)
persist()
paintChips()
if CATS[catIndex].kind == "placed" then
render()
end
toast("Removed: " .. name, true)
return
end
end
end
toast("Nothing to undo", false)
end)
local clearButton = makeButton(main, {
Text = "Clear",
Position = UDim2.fromOffset(386, 0),
Size = UDim2.fromOffset(66, 34),
TextSize = 15,
TextColor3 = THEME.danger,
}, { fill = THEME.surface, stroke = THEME.danger, strokeTransparency = 0.6, radius = 9 })
local clearArmed = false
clearButton.Activated:Connect(function()
if not clearArmed then
clearArmed = true
clearButton.Text = "Sure?"
clearButton.TextColor3 = THEME.text
tween(clearButton, 0.12, { BackgroundColor3 = THEME.danger })
task.delay(2.5, function()
if clearArmed and clearButton.Parent then
clearArmed = false
clearButton.Text = "Clear"
clearButton.TextColor3 = THEME.danger
tween(clearButton, 0.12, { BackgroundColor3 = THEME.surface })
end
end)
return
end
clearArmed = false
clearButton.Text = "Clear"
clearButton.TextColor3 = THEME.danger
tween(clearButton, 0.12, { BackgroundColor3 = THEME.surface })
local removedCount = 0
for _, rec in ipairs(table.clone(records())) do
removeRecord(rec)
removedCount += 1
end
table.clear(history)
persist()
paintChips()
render()
toast(removedCount == 0 and "Nothing to clear" or ("Removed " .. removedCount .. " inserted items"), removedCount > 0)
end)
-- insert by ID bar
local idCard = new("Frame", {
Position = UDim2.fromOffset(0, 38),
Size = UDim2.fromOffset(452, 38),
BackgroundColor3 = THEME.surface,
BorderSizePixel = 0,
}, main)
corner(idCard, 10)
stroke(idCard, THEME.accent, 0.7, 1)
local idBox = field(main, 3, 41, 217, 32, "Insert by ID: paste an asset ID or link...")
local typeButton = makeButton(main, {
Text = "Type: " .. ID_TYPES[idTypeIndex][1],
Position = UDim2.fromOffset(224, 41),
Size = UDim2.fromOffset(104, 32),
TextSize = 13,
}, { fill = THEME.surface2, radius = 9 })
typeButton.Activated:Connect(function()
idTypeIndex = idTypeIndex % #ID_TYPES + 1
typeButton.Text = "Type: " .. ID_TYPES[idTypeIndex][1]
end)
local ACCENT_STYLE = { fill = THEME.accent, hover = THEME.accentSoft, stroke = THEME.accentSoft, strokeTransparency = 0.5, radius = 8 }
local idInsert = makeButton(main, {
Text = "Insert",
Position = UDim2.fromOffset(332, 41),
Size = UDim2.fromOffset(66, 32),
TextSize = 14,
Font = Enum.Font.GothamBlack,
TextColor3 = THEME.dark,
}, { fill = THEME.accent, hover = THEME.accentSoft, stroke = THEME.accentSoft, strokeTransparency = 0.5, radius = 9 })
local idSave = makeButton(main, {
Text = "Save",
Position = UDim2.fromOffset(400, 41),
Size = UDim2.fromOffset(49, 32),
TextSize = 14,
TextColor3 = THEME.accent,
}, { fill = THEME.surface, stroke = THEME.accent, strokeTransparency = 0.6, radius = 9 })
local idBusy = false
local function readId()
local id = string.match(idBox.Text, "%d+")
if not id then
toast("Type or paste a valid asset ID", false)
return nil
end
return id
end
idInsert.Activated:Connect(function()
if idBusy then
return
end
local id = readId()
if not id then
return
end
idBusy = true
idInsert.Text = "..."
toast("Loading model... extracting scripts, please wait", true)
task.spawn(function()
local item = resolveItem(id)
local ok, success, message = pcall(insertNew, item)
if not ok then
message = tostring(success)
success = false
end
toast(tostring(message), success)
paintChips()
if idInsert.Parent then
idInsert.Text = "Insert"
end
idBusy = false
end)
end)
idSave.Activated:Connect(function()
if idBusy then
return
end
local id = readId()
if not id then
return
end
for _, entry in ipairs(st.mine) do
if tostring(entry.id) == id then
toast("This ID is already in My IDs", false)
return
end
end
idBusy = true
idSave.Text = "..."
task.spawn(function()
local item = resolveItem(id)
table.insert(st.mine, { id = id, name = item.name, typeId = item.typeId, creator = item.creator ~= "" and item.creator or "My IDs", desc = item.desc })
persist()
paintChips()
if CATS[catIndex].kind == "mine" then
render()
end
toast("Saved to My IDs: " .. item.name, true)
if idSave.Parent then
idSave.Text = "Save"
end
idBusy = false
end)
end)
local grid = new("ScrollingFrame", {
Position = UDim2.fromOffset(0, 82),
Size = UDim2.fromOffset(452, 310),
BackgroundColor3 = THEME.field,
BorderSizePixel = 0,
ScrollBarThickness = 4,
ScrollBarImageColor3 = THEME.muted,
CanvasSize = UDim2.new(),
AutomaticCanvasSize = Enum.AutomaticSize.Y,
ScrollingDirection = Enum.ScrollingDirection.Y,
}, main)
corner(grid, 12)
stroke(grid, THEME.line, 0.5, 1)
new("UIPadding", {
PaddingTop = UDim.new(0, 8),
PaddingBottom = UDim.new(0, 8),
PaddingLeft = UDim.new(0, 8),
PaddingRight = UDim.new(0, 10),
}, grid)
new("UIGridLayout", {
CellSize = UDim2.fromOffset(138, 156),
CellPadding = UDim2.fromOffset(8, 8),
SortOrder = Enum.SortOrder.LayoutOrder,
}, grid)
local statusLabel = textLabel(main, "", {
Position = UDim2.fromOffset(0, 82),
Size = UDim2.fromOffset(452, 310),
Font = Enum.Font.GothamBold,
TextSize = 16,
TextColor3 = THEME.muted,
TextWrapped = true,
TextXAlignment = Enum.TextXAlignment.Center,
Visible = false,
})
local STAR_ON = utf8.char(0x2605)
local STAR_OFF = utf8.char(0x2606)
local function actionLabel(item)
if item.typeId == "sky" then
return "Apply"
elseif item.typeId == 38 then
return "Copy ID"
elseif item.typeId == 3 or item.typeId == 24 then
return "Add"
end
return "Insert"
end
local function doInsert(item, button, label)
if button:GetAttribute("Busy") then
return
end
button:SetAttribute("Busy", true)
button.Text = "..."
toast("Loading model... extracting scripts, please wait", true)
task.spawn(function()
local ok, success, message = pcall(insertNew, item)
if not ok then
message = tostring(success)
success = false
end
toast(tostring(message), success)
paintChips()
if button.Parent then
button.Text = success and "Done" or "Failed"
task.wait(1.2)
end
if button.Parent then
button.Text = label
button:SetAttribute("Busy", nil)
end
end)
end
local function toggleFav(item)
if st.fav[item.id] ~= nil then
st.fav[item.id] = nil
else
st.fav[item.id] = { id = item.id, name = item.name, typeId = item.typeId, creator = item.creator, desc = item.desc }
end
persist()
paintChips()
return st.fav[item.id] ~= nil
end
-- big preview page
local detail = new("Frame", {
Position = UDim2.fromOffset(0, 0),
Size = UDim2.fromOffset(452, 392),
BackgroundColor3 = THEME.surface,
BorderSizePixel = 0,
Visible = false,
Active = true,
ZIndex = 10,
}, main)
corner(detail, 12)
stroke(detail, THEME.line, 0.4, 1)
local backButton = makeButton(detail, {
Text = "< Back",
Position = UDim2.fromOffset(10, 10),
Size = UDim2.fromOffset(84, 32),
TextSize = 14,
}, { fill = THEME.surface2, radius = 9 })
local dTitle = textLabel(detail, "", {
Position = UDim2.fromOffset(104, 10),
Size = UDim2.fromOffset(336, 32),
Font = Enum.Font.GothamBlack,
TextSize = 15,
TextColor3 = THEME.muted,
TextTruncate = Enum.TextTruncate.AtEnd,
})
local dImageHolder = new("Frame", {
Position = UDim2.fromOffset(14, 54),
Size = UDim2.fromOffset(204, 204),
BackgroundColor3 = THEME.field,
BorderSizePixel = 0,
}, detail)
corner(dImageHolder, 12)
stroke(dImageHolder, THEME.line, 0.4, 1)
local dImage = new("ImageLabel", {
AnchorPoint = Vector2.new(0.5, 0.5),
Position = UDim2.fromScale(0.5, 0.5),
Size = UDim2.new(1, -10, 1, -10),
BackgroundTransparency = 1,
ScaleType = Enum.ScaleType.Fit,
Image = "",
}, dImageHolder)
local dTag = new("Frame", {
AnchorPoint = Vector2.new(1, 0),
Position = UDim2.new(1, -8, 0, 8),
Size = UDim2.fromOffset(70, 22),
BackgroundColor3 = THEME.header,
BackgroundTransparency = 0.1,
BorderSizePixel = 0,
}, dImageHolder)
corner(dTag, 7)
local dTagText = textLabel(dTag, "", {
Size = UDim2.fromScale(1, 1),
Font = Enum.Font.GothamBlack,
TextSize = 12,
TextColor3 = THEME.accent,
TextXAlignment = Enum.TextXAlignment.Center,
})
local dName = textLabel(detail, "", {
Position = UDim2.fromOffset(232, 54),
Size = UDim2.fromOffset(208, 48),
Font = Enum.Font.GothamBlack,
TextSize = 17,
TextWrapped = true,
TextYAlignment = Enum.TextYAlignment.Top,
TextTruncate = Enum.TextTruncate.AtEnd,
})
local dCreator = textLabel(detail, "", {
Position = UDim2.fromOffset(232, 104),
Size = UDim2.fromOffset(208, 18),
TextSize = 13,
TextColor3 = THEME.muted,
TextTruncate = Enum.TextTruncate.AtEnd,
})
local dType = textLabel(detail, "", {
Position = UDim2.fromOffset(232, 124),
Size = UDim2.fromOffset(208, 18),
TextSize = 13,
TextColor3 = THEME.muted,
})
local dIdBox = new("Frame", {
Position = UDim2.fromOffset(232, 148),
Size = UDim2.fromOffset(208, 34),
BackgroundColor3 = THEME.field,
BorderSizePixel = 0,
}, detail)
corner(dIdBox, 9)
stroke(dIdBox, THEME.line, 0.4, 1)
local dId = textLabel(dIdBox, "", {
Position = UDim2.fromOffset(10, 0),
Size = UDim2.new(1, -76, 1, 0),
Font = Enum.Font.GothamBlack,
TextSize = 13,
TextTruncate = Enum.TextTruncate.AtEnd,
})
local dCopyMini = makeButton(dIdBox, {
Text = "Copy",
AnchorPoint = Vector2.new(1, 0.5),
Position = UDim2.new(1, -4, 0.5, 0),
Size = UDim2.fromOffset(60, 26),
TextSize = 12,
Font = Enum.Font.GothamBlack,
TextColor3 = THEME.dark,
}, ACCENT_STYLE)
local dDesc = textLabel(detail, "", {
Position = UDim2.fromOffset(232, 190),
Size = UDim2.fromOffset(208, 68),
TextSize = 12,
TextColor3 = THEME.muted,
TextWrapped = true,
TextYAlignment = Enum.TextYAlignment.Top,
TextTruncate = Enum.TextTruncate.AtEnd,
})
local dInsert = makeButton(detail, {
Text = "Insert",
Position = UDim2.fromOffset(14, 270),
Size = UDim2.fromOffset(204, 42),
TextSize = 16,
Font = Enum.Font.GothamBlack,
TextColor3 = THEME.dark,
}, { fill = THEME.accent, hover = THEME.accentSoft, stroke = THEME.accentSoft, strokeTransparency = 0.5, radius = 10 })
local dFav = makeButton(detail, {
Text = "Favorite",
Position = UDim2.fromOffset(232, 270),
Size = UDim2.fromOffset(100, 42),
TextSize = 14,
}, { fill = THEME.surface2, radius = 10 })
local dLink = makeButton(detail, {
Text = "Copy link",
Position = UDim2.fromOffset(340, 270),
Size = UDim2.fromOffset(100, 42),
TextSize = 14,
}, { fill = THEME.surface2, radius = 10 })
local dSave = makeButton(detail, {
Text = "Save to My IDs",
Position = UDim2.fromOffset(14, 320),
Size = UDim2.fromOffset(204, 36),
TextSize = 14,
TextColor3 = THEME.accent,
}, { fill = THEME.surface, stroke = THEME.accent, strokeTransparency = 0.6, radius = 10 })
local dCopyId = makeButton(detail, {
Text = "Copy ID",
Position = UDim2.fromOffset(232, 320),
Size = UDim2.fromOffset(208, 36),
TextSize = 14,
}, { fill = THEME.surface2, radius = 10 })
textLabel(detail, "Items are inserted untouched, in front of your camera, just like the real Toolbox.", {
Position = UDim2.fromOffset(14, 364),
Size = UDim2.fromOffset(424, 16),
TextSize = 11,
TextColor3 = THEME.muted,
})
local function copyId(id)
if copyText(tostring(id)) then
toast("ID copied: " .. tostring(id), true)
else
toast("Clipboard is not supported. ID: " .. tostring(id), false)
end
end
local function paintFav(button, on)
button.Text = (on and STAR_ON or STAR_OFF) .. " Favorite"
button.TextColor3 = on and THEME.accent or THEME.text
end
openDetail = function(item)
detailItem = item
dTitle.Text = "Preview"
dImage.Image = "rbxthumb://type=Asset&id=" .. tostring(item.id) .. "&w=420&h=420"
dName.Text = tostring(item.name)
local creator = tostring(item.creator or "")
dCreator.Text = "By " .. (creator ~= "" and creator or "Unknown")
dType.Text = "Type: " .. (TYPE_NAMES[item.typeId] or "Item")
dTagText.Text = TYPE_NAMES[item.typeId] or "Item"
dId.Text = "ID  " .. tostring(item.id)
local desc = tostring(item.desc or "")
dDesc.Text = desc ~= "" and desc or "No description available."
dInsert.Text = actionLabel(item)
dInsert:SetAttribute("Busy", nil)
paintFav(dFav, st.fav[item.id] ~= nil)
detail.Visible = true
detail.Position = UDim2.fromOffset(0, 14)
tween(detail, 0.25, { Position = UDim2.fromOffset(0, 0) }, Enum.EasingStyle.Quint)
end
local function closeDetail()
detailItem = nil
detail.Visible = false
end
backButton.Activated:Connect(closeDetail)
dCopyMini.Activated:Connect(function()
if detailItem then
copyId(detailItem.id)
end
end)
dCopyId.Activated:Connect(function()
if detailItem then
copyId(detailItem.id)
end
end)
dLink.Activated:Connect(function()
if detailItem then
local link = "https://create.roblox.com/store/asset/" .. tostring(detailItem.id)
if copyText(link) then
toast("Link copied", true)
else
toast(link, false)
end
end
end)
dInsert.Activated:Connect(function()
if detailItem then
doInsert(detailItem, dInsert, actionLabel(detailItem))
end
end)
dFav.Activated:Connect(function()
if detailItem then
paintFav(dFav, toggleFav(detailItem))
if CATS[catIndex].kind == "fav" then
render()
end
end
end)
dSave.Activated:Connect(function()
if not detailItem then
return
end
for _, entry in ipairs(st.mine) do
if tostring(entry.id) == tostring(detailItem.id) then
toast("This ID is already in My IDs", false)
return
end
end
table.insert(st.mine, {
id = tostring(detailItem.id),
name = tostring(detailItem.name),
typeId = detailItem.typeId,
creator = tostring(detailItem.creator or "") ~= "" and tostring(detailItem.creator) or "My IDs",
desc = tostring(detailItem.desc or ""),
})
persist()
paintChips()
toast("Saved to My IDs: " .. tostring(detailItem.name), true)
end)
local function cardBase(item, index, missing)
local card = new("Frame", {
BackgroundColor3 = Color3.new(1, 1, 1),
BorderSizePixel = 0,
LayoutOrder = index,
}, grid)
corner(card, 10)
new("UIGradient", { Color = ColorSequence.new(THEME.surface2, THEME.surface), Rotation = 90 }, card)
local cardStroke = stroke(card, THEME.line, 0.6, 1)
local thumb = new("ImageLabel", {
Position = UDim2.fromOffset(6, 6),
Size = UDim2.fromOffset(126, 82),
BackgroundColor3 = THEME.field,
BorderSizePixel = 0,
ScaleType = Enum.ScaleType.Fit,
Image = "rbxthumb://type=Asset&id=" .. item.id .. "&w=150&h=150",
}, card)
corner(thumb, 8)
local tagText = missing and "Missing" or (TYPE_NAMES[item.typeId] or "Item")
local tagBox = new("Frame", {
AnchorPoint = Vector2.new(1, 0),
Position = UDim2.new(1, -4, 0, 4),
Size = UDim2.fromOffset(#tagText * 7 + 14, 18),
BackgroundColor3 = THEME.header,
BackgroundTransparency = 0.15,
BorderSizePixel = 0,
}, thumb)
corner(tagBox, 6)
textLabel(tagBox, tagText, {
Size = UDim2.fromScale(1, 1),
Font = Enum.Font.GothamBlack,
TextSize = 11,
TextColor3 = missing and THEME.danger or THEME.accent,
TextXAlignment = Enum.TextXAlignment.Center,
})
textLabel(card, item.name, {
Position = UDim2.fromOffset(8, 91),
Size = UDim2.new(1, -16, 0, 17),
Font = Enum.Font.GothamBlack,
TextSize = 15,
TextTruncate = Enum.TextTruncate.AtEnd,
})
local creator = tostring(item.creator or "")
textLabel(card, (creator ~= "" and creator or "Unknown") .. "  |  " .. item.id, {
Position = UDim2.fromOffset(8, 108),
Size = UDim2.new(1, -16, 0, 13),
Font = Enum.Font.GothamBold,
TextSize = 11,
TextColor3 = THEME.muted,
TextTruncate = Enum.TextTruncate.AtEnd,
})
-- tap the picture or the name to open the big preview
local openArea = new("TextButton", {
Text = "",
Position = UDim2.fromOffset(0, 0),
Size = UDim2.fromOffset(138, 124),
BackgroundTransparency = 1,
AutoButtonColor = false,
BorderSizePixel = 0,
}, card)
openArea.MouseEnter:Connect(function()
tween(cardStroke, 0.12, { Color = THEME.accent, Transparency = 0.1 })
end)
openArea.MouseLeave:Connect(function()
tween(cardStroke, 0.12, { Color = THEME.line, Transparency = 0.6 })
end)
openArea.Activated:Connect(function()
openDetail({
id = tostring(item.id),
name = tostring(item.name),
typeId = item.typeId,
creator = tostring(item.creator or ""),
desc = tostring(item.desc or ""),
})
end)
return card
end
local function buildItemCard(item, index, canDelete)
local card = cardBase(item, index, false)
local insertWidth = canDelete and 66 or 94
local label = actionLabel(item)
local insertButton = makeButton(card, {
Text = label,
Position = UDim2.fromOffset(6, 126),
Size = UDim2.fromOffset(insertWidth, 26),
TextSize = 14,
Font = Enum.Font.GothamBlack,
TextColor3 = THEME.dark,
}, ACCENT_STYLE)
local isFav = st.fav[item.id] ~= nil
local favButton = makeButton(card, {
Text = isFav and STAR_ON or STAR_OFF,
Position = UDim2.fromOffset(6 + insertWidth + 4, 126),
Size = UDim2.fromOffset(26, 26),
TextSize = 16,
TextColor3 = isFav and THEME.accent or THEME.muted,
}, { fill = THEME.surface, radius = 8 })
insertButton.Activated:Connect(function()
doInsert(item, insertButton, label)
end)
favButton.Activated:Connect(function()
local now = toggleFav(item)
if CATS[catIndex].kind == "fav" then
render()
return
end
favButton.Text = now and STAR_ON or STAR_OFF
favButton.TextColor3 = now and THEME.accent or THEME.muted
end)
if canDelete then
local deleteButton = makeButton(card, {
Text = "X",
Position = UDim2.fromOffset(6 + insertWidth + 4 + 30, 126),
Size = UDim2.fromOffset(26, 26),
TextSize = 14,
TextColor3 = THEME.danger,
}, { fill = THEME.surface, stroke = THEME.danger, strokeTransparency = 0.6, radius = 8 })
local armed = false
deleteButton.Activated:Connect(function()
if not armed then
armed = true
deleteButton.Text = "?"
tween(deleteButton, 0.12, { BackgroundColor3 = THEME.danger })
task.delay(2.5, function()
if armed and deleteButton.Parent then
armed = false
deleteButton.Text = "X"
tween(deleteButton, 0.12, { BackgroundColor3 = THEME.surface })
end
end)
return
end
for i, entry in ipairs(st.mine) do
if tostring(entry.id) == item.id then
table.remove(st.mine, i)
break
end
end
persist()
render()
toast("Removed from My IDs", true)
end)
end
end
local function buildPlacedCard(rec, index, index2)
local inst = index2[rec.uid] and index2[rec.uid][1] or nil
local card = cardBase(rec, index, inst == nil and rec.typeId ~= 38)
local selectButton = makeButton(card, {
Text = inst and "Select" or "Restore",
Position = UDim2.fromOffset(6, 126),
Size = UDim2.fromOffset(60, 26),
TextSize = 12,
Font = Enum.Font.GothamBlack,
TextColor3 = THEME.dark,
}, ACCENT_STYLE)
local goButton = makeButton(card, {
Text = "Go",
Position = UDim2.fromOffset(70, 126),
Size = UDim2.fromOffset(32, 26),
TextSize = 14,
TextColor3 = THEME.accent,
}, { fill = THEME.surface, radius = 8 })
local deleteButton = makeButton(card, {
Text = "X",
Position = UDim2.fromOffset(106, 126),
Size = UDim2.fromOffset(26, 26),
TextSize = 14,
TextColor3 = THEME.danger,
}, { fill = THEME.surface, stroke = THEME.danger, strokeTransparency = 0.6, radius = 8 })
selectButton.Activated:Connect(function()
local targets = findAll(rec.uid)
if #targets == 0 then
task.spawn(function()
local ok, success, message = pcall(createItem, rec, true)
toast(ok and tostring(message) or tostring(success), ok and success)
render()
end)
return
end
pcall(function()
game:GetService("Selection"):Set(targets)
end)
toast("Selected: " .. rec.name, true)
end)
goButton.Activated:Connect(function()
local target = findByUid(rec.uid)
if not target then
toast("This item is missing. Tap Restore first.", false)
return
end
local ok = pcall(function()
local position = target:GetPivot().Position
local camera = svc("Workspace").CurrentCamera
camera.CFrame = CFrame.lookAt(position + Vector3.new(0, 12, 24), position)
end)
toast(ok and ("Camera moved to " .. rec.name) or "This item has no position", ok)
end)
local armed = false
deleteButton.Activated:Connect(function()
if not armed then
armed = true
deleteButton.Text = "?"
tween(deleteButton, 0.12, { BackgroundColor3 = THEME.danger })
task.delay(2.5, function()
if armed and deleteButton.Parent then
armed = false
deleteButton.Text = "X"
tween(deleteButton, 0.12, { BackgroundColor3 = THEME.surface })
end
end)
return
end
removeRecord(rec)
persist()
render()
toast("Deleted: " .. rec.name, true)
end)
end
local function localList(entries)
local list = {}
local query = string.lower(keyword)
for _, entry in ipairs(entries) do
local name = tostring(entry.name)
local id = tostring(entry.id)
if query == "" or string.find(string.lower(name), query, 1, true) or string.find(id, query, 1, true) then
table.insert(list, { id = id, name = name, typeId = entry.typeId, creator = tostring(entry.creator or ""), desc = tostring(entry.desc or ""), rec = entry })
end
end
return list
end
render = function()
for _, child in ipairs(grid:GetChildren()) do
if child:IsA("GuiObject") then
child:Destroy()
end
end
paintChips()
local cat = CATS[catIndex]
local kind = cat.kind
local isMine = kind == "mine"
local list = items
if kind == "fav" then
local entries = {}
for _, entry in pairs(st.fav) do
table.insert(entries, entry)
end
table.sort(entries, function(a, b)
return string.lower(tostring(a.name)) < string.lower(tostring(b.name))
end)
list = localList(entries)
elseif isMine then
list = localList(st.mine)
elseif kind == "placed" then
list = localList(records())
end
local lineBreak = utf8.char(10)
if #list == 0 then
grid.Visible = false
statusLabel.Visible = true
if loading then
statusLabel.Text = "Loading from the store..."
elseif loadError then
statusLabel.Text = loadError .. lineBreak .. "Check that your executor allows HTTP requests, then tap the category again."
elseif kind == "fav" then
statusLabel.Text = "No favorites yet" .. lineBreak .. "Tap the star on any item to pin it"
elseif isMine then
statusLabel.Text = "Nothing saved here yet" .. lineBreak .. "Type an asset ID above and tap Save"
elseif kind == "placed" then
statusLabel.Text = "Nothing placed yet" .. lineBreak .. "Everything you insert is listed here and comes back after Play mode"
else
statusLabel.Text = "No results" .. lineBreak .. "Try another search or category"
end
return
end
statusLabel.Visible = false
grid.Visible = true
local index2 = kind == "placed" and buildIndex() or nil
for index, item in ipairs(list) do
if kind == "placed" then
buildPlacedCard(item.rec, index, index2)
else
buildItemCard(item, index, isMine)
end
end
if cat.typeId and (cursor or loading or loadError) then
local more = makeButton(grid, {
Text = loading and "Loading..." or (loadError and "Retry" or "Load more"),
LayoutOrder = 99999,
TextSize = 15,
Font = Enum.Font.GothamBlack,
TextColor3 = THEME.accent,
}, { fill = THEME.surface, stroke = THEME.accent, strokeTransparency = 0.6, radius = 10 })
more.Activated:Connect(function()
if not loading then
refresh(false)
end
end)
end
end
local token = {}
genv.DZHUP_TBToken = token
local lastKey = ctx.placeKey()
task.spawn(function()
task.wait(2.5)
local count = restoreAll(false)
if count > 0 then
toast("Toolbox restored " .. count .. " items", true)
end
paintChips()
lastKey = ctx.placeKey()
while genv.DZHUP_TBToken == token do
task.wait(1.5)
local key = ctx.placeKey()
if key ~= lastKey or sentinel.dead() then
lastKey = key
table.clear(history)
task.wait(2)
sentinel.reset()
local restored = restoreAll(false)
if restored > 0 then
toast("Toolbox restored " .. restored .. " items", true)
end
render()
end
end
end)
render()
return {
onShow = function()
if not loadedOnce then
loadedOnce = true
refresh(true)
else
render()
end
end,
}
end,
})
local currentTab = 1
do -- BLOCK modules
local namesPage = newPage()
local namesBody = new("Frame", {
Position = UDim2.fromOffset(0, 36),
Size = UDim2.fromOffset(588, 356),
BackgroundTransparency = 1,
}, namesPage)
createPage.Parent = namesBody
studioPage.Parent = namesBody
listPage.Parent = namesBody
worldPage.Parent = namesBody
local SUBS = {
{ key = "create", title = "Create", page = createPage },
{ key = "style", title = "Style", page = studioPage },
{ key = "saved", title = "Saved", page = listPage },
{ key = "world", title = "World", page = worldPage },
}
local subIndex = 1
local function showSub(index)
subIndex = index
for i, sub in ipairs(SUBS) do
local active = i == index
if active and not sub.page.Visible then
sub.page.Position = UDim2.fromOffset(0, 10)
tween(sub.page, 0.28, { Position = UDim2.fromOffset(0, 0) }, Enum.EasingStyle.Quint)
end
sub.page.Visible = active
tween(sub.button, 0.14, { BackgroundColor3 = active and THEME.accent or THEME.surface2 })
sub.button.TextColor3 = active and THEME.dark or THEME.text
end
if SUBS[index].key == "saved" then
renderList()
end
end
for index, sub in ipairs(SUBS) do
local button = new("TextButton", {
Text = sub.title,
Position = UDim2.fromOffset((index - 1) * 110, 0),
Size = UDim2.fromOffset(104, 30),
Font = Enum.Font.GothamBlack,
TextSize = 15,
TextColor3 = THEME.text,
BackgroundColor3 = THEME.surface2,
AutoButtonColor = false,
BorderSizePixel = 0,
}, namesPage)
corner(button, 8)
stroke(button, THEME.line, 0.4, 1)
sub.button = button
button.Activated:Connect(function()
showSub(index)
end)
end
function H.setSubTitle(key, text)
for _, sub in ipairs(SUBS) do
if sub.key == key then
sub.title = text
sub.button.Text = text
end
end
end
H.registerModule({ key = "names", title = "Names", order = 10, page = namesPage, onShow = function()
showSub(subIndex)
end })
H.registerModule({ key = "creator", title = "Creator", order = 90, page = aboutPage })
local ctx = {
new = new, corner = corner, stroke = stroke, tween = tween, loop = loop,
textLabel = textLabel, makeButton = makeButton, THEME = THEME,
toast = showToast, trim = trim, persist = persist, save = save,
copyText = copyText, genv = genv, on = on, hasFS = hasFS,
viewBasis = viewBasis, findSpawn = findSpawnPosition, sentinel = H.sentinel,
placeKey = function()
return placeKey
end,
store = function(name)
local t = save.settings[name]
if type(t) ~= "table" then
t = {}
save.settings[name] = t
end
return t
end,
}
table.sort(H.modules, function(a, b)
return (a.order or 100) < (b.order or 100)
end)
for _, def in ipairs(H.modules) do
if def.build then
local ok, api = pcall(def.build, def.page, ctx)
if ok then
def.onShow = type(api) == "table" and api.onShow or def.onShow
else
warn("[DZHUP] Module " .. tostring(def.title) .. " could not be built: " .. tostring(api))
end
end
end
local count = #H.modules
H.tabW = math.max(84, math.floor(588 / count))
tabScroll.CanvasSize = UDim2.fromOffset(H.tabW * count, 0)
tabIndicator.Size = UDim2.fromOffset(H.tabW - 8, 30)
for i, def in ipairs(H.modules) do
def.button = new("TextButton", {
Position = UDim2.fromOffset((i - 1) * H.tabW, 0),
Size = UDim2.fromOffset(H.tabW, 38),
BackgroundTransparency = 1,
AutoButtonColor = false,
Text = def.title,
Font = Enum.Font.GothamBlack,
TextSize = 15,
TextColor3 = THEME.text,
ZIndex = 3,
}, tabScroll)
def.button.Activated:Connect(function()
H.switchTab(i)
end)
end
end -- BLOCK modules
local function switchTab(index, instant)
currentTab = index
for i, def in ipairs(H.modules) do
if i == index and not def.page.Visible and not instant then
def.page.Position = UDim2.fromOffset(0, 12)
tween(def.page, 0.3, { Position = UDim2.fromOffset(0, 0) }, Enum.EasingStyle.Quint)
end
def.page.Visible = i == index
if def.button then
def.button.TextColor3 = i == index and THEME.dark or THEME.muted
end
end
local x = (index - 1) * H.tabW
local target = UDim2.fromOffset(x + 4, 4)
if instant then
tabIndicator.Position = target
else
tween(tabIndicator, 0.3, { Position = target }, Enum.EasingStyle.Quint)
end
pcall(function()
local view = tabScroll.AbsoluteWindowSize.X
local current = tabScroll.CanvasPosition.X
if x < current then
tabScroll.CanvasPosition = Vector2.new(x, 0)
elseif x + H.tabW > current + view then
tabScroll.CanvasPosition = Vector2.new(x + H.tabW - view, 0)
end
end)
local def = H.modules[index]
if def and def.onShow then
pcall(def.onShow)
end
end
H.switchTab = switchTab
do -- BLOCK dragresize
local resizeHandle = new("TextButton", {
Name = "ResizeHandle",
AnchorPoint = Vector2.new(1, 1),
Position = UDim2.new(1, 0, 1, 0),
Size = UDim2.fromOffset(38, 38),
BackgroundTransparency = 1,
Text = "",
AutoButtonColor = false,
Active = true,
ZIndex = 20,
}, panel)
local gripDots = {}
for row = 0, 2 do
for col = 0, 2 - row do
local dot = new("Frame", {
AnchorPoint = Vector2.new(1, 1),
Position = UDim2.new(1, -(9 + col * 6), 1, -(9 + row * 6)),
Size = UDim2.fromOffset(3, 3),
BackgroundColor3 = THEME.muted,
BorderSizePixel = 0,
ZIndex = 21,
}, resizeHandle)
corner(dot, 2)
table.insert(gripDots, dot)
end
end
local function tintGrip(color)
for _, dot in ipairs(gripDots) do
tween(dot, 0.12, { BackgroundColor3 = color })
end
end
resizeHandle.MouseEnter:Connect(function()
tintGrip(THEME.accent)
end)
resizeHandle.MouseLeave:Connect(function()
tintGrip(THEME.muted)
end)
local function isPointer(input)
return input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch
end
local function pointOf(input)
return Vector2.new(input.Position.X, input.Position.Y)
end
local dragging, resizing = false, false
local dragStart, startOffset = Vector2.zero, Vector2.zero
local resizeStart, startScale = Vector2.zero, 1
header.InputBegan:Connect(function(input)
if isPointer(input) and not resizing then
dragging = true
dragStart = pointOf(input)
startOffset = Vector2.new(holder.Position.X.Offset, holder.Position.Y.Offset)
end
end)
resizeHandle.InputBegan:Connect(function(input)
if isPointer(input) and not dragging then
resizing = true
resizeStart = pointOf(input)
startScale = scaler.Scale
tintGrip(THEME.accent)
tween(panelStroke, 0.12, { Color = THEME.accent, Transparency = 0.2 })
end
end)
on(UserInputService.InputChanged, function(input)
if input.UserInputType ~= Enum.UserInputType.MouseMovement and input.UserInputType ~= Enum.UserInputType.Touch then
return
end
if dragging then
local delta = pointOf(input) - dragStart
holder.Position = UDim2.fromOffset(startOffset.X + delta.X, startOffset.Y + delta.Y)
clampHolder()
elseif resizing then
local delta = pointOf(input) - resizeStart
local x, y = holder.Position.X.Offset, holder.Position.Y.Offset
local target = startScale + (delta.X / PANEL_W + delta.Y / PANEL_H) / 2
scaler.Scale = math.clamp(target, MIN_SCALE, maxScaleFor(x, y))
end
end)
on(UserInputService.InputEnded, function(input)
if not isPointer(input) then
return
end
if resizing then
resizing = false
tintGrip(THEME.muted)
tween(panelStroke, 0.25, { Color = THEME.line, Transparency = 0.2 })
end
dragging = false
end)
end -- BLOCK dragresize
do -- BLOCK openclose
local veil = new("Frame", {
Name = "Veil",
Size = UDim2.fromScale(1, 1),
BackgroundColor3 = THEME.bg,
BackgroundTransparency = 1,
BorderSizePixel = 0,
ZIndex = 40,
Visible = false,
}, panel)
corner(veil, 16)
local isOpen = false
local openToken = 0
local function hideOpenButton(token)
tween(openButtonScale, 0.28, { Scale = 0 }, Enum.EasingStyle.Back, Enum.EasingDirection.In)
tween(openButton, 0.28, { Rotation = 120, BackgroundTransparency = 1, TextTransparency = 1 }, Enum.EasingStyle.Quad, Enum.EasingDirection.In)
tween(openStroke, 0.25, { Transparency = 1 })
task.delay(0.3, function()
if token == openToken and isOpen then
openButton.Visible = false
end
end)
end
local function showOpenButton(token)
openButton.Visible = true
openButtonScale.Scale = 0
openButton.Rotation = -180
openButton.BackgroundTransparency = 1
openButton.TextTransparency = 1
openStroke.Transparency = 1
task.delay(0.22, function()
if token ~= openToken or isOpen then
return
end
tween(openButtonScale, 0.6, { Scale = 1 }, Enum.EasingStyle.Back, Enum.EasingDirection.Out)
tween(openButton, 0.6, { Rotation = 0 }, Enum.EasingStyle.Quint, Enum.EasingDirection.Out)
tween(openButton, 0.4, { BackgroundTransparency = 0.5, TextTransparency = 0.1 }, Enum.EasingStyle.Sine)
tween(openStroke, 0.5, { Transparency = 0.45 }, Enum.EasingStyle.Sine)
local ring = new("Frame", {
AnchorPoint = Vector2.new(0.5, 0.5),
Position = UDim2.new(0, 34, 0.5, 0),
Size = UDim2.fromOffset(44, 44),
BackgroundTransparency = 1,
BorderSizePixel = 0,
}, gui)
corner(ring, 100)
local ringLine = stroke(ring, THEME.accent, 0.1, 2.5)
tween(ring, 0.8, { Size = UDim2.fromOffset(120, 120) }, Enum.EasingStyle.Quint)
tween(ringLine, 0.8, { Transparency = 1, Thickness = 0.5 }, Enum.EasingStyle.Quad)
task.delay(0.85, function()
ring:Destroy()
end)
task.delay(0.45, function()
if token ~= openToken or isOpen then
return
end
tween(openButtonScale, 0.14, { Scale = 1.12 }, Enum.EasingStyle.Sine)
task.delay(0.14, function()
if token == openToken and not isOpen then
tween(openButtonScale, 0.25, { Scale = 1 }, Enum.EasingStyle.Back)
end
end)
end)
end)
end
local function setOpen(open)
if isOpen == open then
return
end
isOpen = open
openToken += 1
local token = openToken
if open then
hideOpenButton(token)
if not placed then
placeInitially()
else
scaler.Scale = math.min(scaler.Scale, maxScaleFor(0, 0))
clampHolder()
end
holder.Visible = true
backdrop.Visible = true
veil.Visible = true
veil.BackgroundTransparency = 0
panel.Position = UDim2.new(0.5, 0, 0.5, 30)
popScale.Scale = 0.9
tabTrack.Position = UDim2.fromOffset(16, TAB_Y + 14)
content.Position = UDim2.fromOffset(16, CONTENT_Y + 22)
sweep.Size = UDim2.new(0, 0, 0, 1)
sweep.BackgroundTransparency = 0
panelStroke.Color = THEME.accent
panelStroke.Transparency = 0
tween(backdrop, 0.4, { BackgroundTransparency = 0.62 })
tween(veil, 0.45, { BackgroundTransparency = 1 }, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0.05)
tween(panel, 0.6, { Position = UDim2.new(0.5, 0, 0.5, 0) }, Enum.EasingStyle.Quint)
tween(popScale, 0.6, { Scale = 1 }, Enum.EasingStyle.Quint)
tween(panelStroke, 0.9, { Color = THEME.line, Transparency = 0.2 }, Enum.EasingStyle.Sine)
tween(sweep, 0.7, { Size = UDim2.new(1, 0, 0, 1) }, Enum.EasingStyle.Quint, Enum.EasingDirection.Out, 0.08)
tween(sweep, 0.5, { BackgroundTransparency = 0.6 }, Enum.EasingStyle.Sine, Enum.EasingDirection.Out, 0.6)
tween(tabTrack, 0.5, { Position = UDim2.fromOffset(16, TAB_Y) }, Enum.EasingStyle.Quint, Enum.EasingDirection.Out, 0.1)
tween(content, 0.55, { Position = UDim2.fromOffset(16, CONTENT_Y) }, Enum.EasingStyle.Quint, Enum.EasingDirection.Out, 0.18)
task.delay(0.55, function()
if token == openToken and isOpen then
veil.Visible = false
end
end)
else
veil.Visible = true
showOpenButton(token)
tween(backdrop, 0.22, { BackgroundTransparency = 1 })
tween(veil, 0.2, { BackgroundTransparency = 0 }, Enum.EasingStyle.Quad, Enum.EasingDirection.In)
tween(panel, 0.24, { Position = UDim2.new(0.5, 0, 0.5, 14) }, Enum.EasingStyle.Quint, Enum.EasingDirection.In)
tween(popScale, 0.24, { Scale = 0.95 }, Enum.EasingStyle.Quint, Enum.EasingDirection.In)
task.delay(0.26, function()
if token == openToken and not isOpen then
holder.Visible = false
backdrop.Visible = false
veil.Visible = false
end
end)
end
end
openButton.Activated:Connect(function()
setOpen(not isOpen)
end)
closeButton.Activated:Connect(function()
setOpen(false)
end)
on(UserInputService.InputBegan, function(input, processed)
if processed then
return
end
if input.KeyCode == CONFIG.ToggleKey then
setOpen(not isOpen)
end
end)
end -- BLOCK openclose
local busy = false
local function setBusy(state)
busy = state
createButton.Text = state and "BUILDING LETTERS..." or "CREATE 3D NAME"
createButton.TextTransparency = state and 0.35 or 0
end
local function cleanName(value)
local name = string.gsub(value, "%c", "")
name = trim(name)
name = string.gsub(name, "%s+", " ")
local count = utf8.len(name)
if name == "" or not count or count > CONFIG.MaxNameLength then
return nil
end
return name
end
local function rememberSettings()
save.settings.last = {
color = selectedColorIndex,
color2 = selectedColor2Index,
dual = dualOn,
style = selectedStyle,
font = selectedFont.key,
size = studio.size,
gap = studio.gap,
shape = studio.shape,
case = studio.case,
fx = {
glow = studio.fx.glow,
float = studio.fx.float,
rainbow = studio.fx.rainbow,
sparkles = studio.fx.sparkles,
},
}
end
local function submit()
if busy then
return
end
local name = cleanName(nameBox.Text)
if not name then
showToast("Type a name (1 to " .. CONFIG.MaxNameLength .. " characters)", false)
return
end
if #names >= CONFIG.MaxNames then
showToast("Name limit reached. Delete one first.", false)
return
end
name = applyCase(name)
local color = selectedColor()
local order = 0
for _, item in ipairs(names) do
order = math.max(order, item.order or 0)
end
local entry = {
id = string.sub(string.gsub(HttpService:GenerateGUID(false), "-", ""), 1, 12),
order = order + 1,
name = name,
style = selectedStyle,
font = selectedFont.key,
size = SIZE_VALUES[studio.size],
gap = SPACING_VALUES[studio.gap],
shape = studio.shape ~= "Straight" and studio.shape or nil,
fx = currentFx(),
color2 = dualOn and {
math.floor(selectedColor2().R * 255 + 0.5),
math.floor(selectedColor2().G * 255 + 0.5),
math.floor(selectedColor2().B * 255 + 0.5),
} or nil,
color = {
math.floor(color.R * 255 + 0.5),
math.floor(color.G * 255 + 0.5),
math.floor(color.B * 255 + 0.5),
},
}
setBusy(true)
task.spawn(function()
local center, rotation, right = getPlacement()
storePlacement(entry, center, rotation, right)
local ok, group, err = pcall(buildName, entry)
setBusy(false)
if not ok then
warn("[DZHUP] " .. tostring(group))
showToast("Could not build the name. Check the console.", false)
return
end
if not group then
showToast(tostring(err or "Could not create the name"), false)
return
end
table.insert(names, entry)
rememberSettings()
local saved = persist()
renderList()
local effectsOk = H.ensureEffects(false)
if saved then
if effectsOk then
showToast("Name created and saved", true)
else
showToast("Name created (effects script could not be installed here)", true)
end
else
showToast("Name created (saving is not supported here)", true)
end
end)
end
createButton.Activated:Connect(submit)
nameBox.FocusLost:Connect(function(enterPressed)
if enterPressed then
submit()
end
end)
do
local last = save.settings.last
if type(last) == "table" then
if PALETTE[last.color] then
selectedColorIndex = last.color
end
if PALETTE[last.color2] then
selectedColor2Index = last.color2
end
dualOn = last.dual == true
if FONT_BY_KEY[last.font] then
selectedFont = FONT_BY_KEY[last.font]
end
if STYLE_TITLES[last.style] then
selectedStyle = last.style
end
if SIZE_VALUES[last.size] then
studio.size = last.size
end
if SPACING_VALUES[last.gap] then
studio.gap = last.gap
end
if SHAPE_TITLES[last.shape] then
studio.shape = last.shape
end
for _, item in ipairs(CASES) do
if item.key == last.case then
studio.case = last.case
end
end
if type(last.fx) == "table" then
for key in pairs(studio.fx) do
studio.fx[key] = last.fx[key] == true
end
end
end
end
setStyle(selectedStyle)
setFont(selectedFont.key)
refreshStudio()
switchTab(1, true)
updatePreview()
renderList()
genv.DZHUP_NameMakerCleanup = function()
for _, c in ipairs(conns) do
pcall(function()
c:Disconnect()
end)
end
pcall(function()
gui:Destroy()
end)
pcall(function()
clickSound:Destroy()
end)
end
task.spawn(function()
task.wait(0.5)
H.ensureEffects(false)
end)
H.restoring = false
function H.restore(waitFirst)
if H.restoring then
return
end
H.restoring = true
local warned = false
if waitFirst then
task.wait(1)
end
H.getFolder()
local anchor = findSpawnPosition()
local moved = 0
local waited = 0
while not Workspace.CurrentCamera and waited < 5 do
task.wait(0.25)
waited += 0.25
end
local viewPosition = viewBasis()
for _, entry in ipairs(table.clone(names)) do
local existing = H.getFolder():FindFirstChild(modelNameOf(entry))
if existing then
H.hold(existing)
pcall(H.upgrade, existing)
pcall(H.adopt, existing)
else
if type(entry.center) == "table" then
local saved = Vector3.new(entry.center[1], entry.center[2], entry.center[3])
if flat(saved - viewPosition).Magnitude > CONFIG.RestoreMaxDistance or saved.Y > anchor.Y + 200 then
local center, rotation, right = getPlacement(entry)
moved += 1
storePlacement(entry, center, rotation, right)
end
end
local ok, group, err = pcall(buildName, entry)
if (not ok or not group) and not warned then
warned = true
warn("[DZHUP] Could not restore saved names: " .. tostring(ok and err or group))
end
end
task.wait()
end
if moved > 0 then
persist()
end
H.restoring = false
end
task.spawn(H.restore, true)
task.spawn(function()
task.wait(1.5)
if H.applyClock then
pcall(H.applyClock)
end
end)
task.spawn(function()
local token = {}
genv.DZHUP_WatchToken = token
while genv.DZHUP_WatchToken == token do
task.wait(1.5)
if not H.restoring then
local changedProject = false
local key = computeKey()
if key ~= placeKey then
changedProject = true
save.places[placeKey] = table.clone(names)
local nextList = save.places[key]
table.clear(names)
if type(nextList) == "table" then
for _, item in ipairs(nextList) do
table.insert(names, item)
end
end
save.places[key] = names
placeKey = key
persist()
table.clear(templates)
table.clear(animated)
end
local stale = H.nameSentinel.dead()
if changedProject or stale then
H.nameSentinel.reset()
table.clear(animated)
H.getFolder()
pcall(renderList)
if H.applyClock then
pcall(H.applyClock)
end
task.spawn(H.restore, false)
task.spawn(function()
task.wait(1)
H.ensureEffects(true)
end)
end
end
end
end)
for _, font in ipairs(FONTS) do
if (not font.packId or font.packId == 0) and next(font.letterIds or {}) == nil then
warn("[DZHUP] Font " .. font.title .. " has no asset id. Set packId in CONFIG.Fonts.")
end
end
local function askNotification(title, text, yesText, onYes)
local answered = false
local callback = Instance.new("BindableFunction")
callback.OnInvoke = function(choice)
answered = true
if choice == yesText then
onYes()
end
end
local sent = false
for _ = 1, 8 do
local ok = pcall(function()
StarterGui:SetCore("SendNotification", {
Title = title,
Text = text,
Duration = 15,
Button1 = yesText,
Button2 = "Not now",
Callback = callback,
})
end)
if ok then
sent = true
break
end
task.wait(1)
end
if not sent then
callback:Destroy()
return
end
local waitedNote = 0
while not answered and waitedNote < 16 do
task.wait(0.25)
waitedNote += 0.25
end
callback:Destroy()
end
local function notifyCopied(text)
pcall(function()
StarterGui:SetCore("SendNotification", { Title = CONFIG.Creator, Text = text, Duration = 5 })
end)
end
if CONFIG.PromptOnLaunch then
task.spawn(function()
task.wait(3)
askNotification(CONFIG.Creator .. "  |  " .. CONFIG.Community, "Do you want to join my Discord community?", "Join", function()
if copyText(CONFIG.Discord) then
notifyCopied("Discord link copied. Paste it in your browser.")
else
notifyCopied(CONFIG.Discord)
end
end)
task.wait(1)
askNotification(CONFIG.Creator .. "  |  " .. CONFIG.Community, "Do you want to follow my WhatsApp channel?", "Follow", function()
if copyText(CONFIG.WhatsApp) then
notifyCopied("WhatsApp link copied. Paste it in your browser.")
else
notifyCopied(CONFIG.WhatsApp)
end
end)
task.wait(1)
askNotification(CONFIG.Creator .. "  |  " .. CONFIG.Community, "Do you want to follow my TikTok account?", "Follow", function()
if copyText(CONFIG.TikTok) then
notifyCopied("TikTok link copied. Paste it in your browser.")
else
notifyCopied(CONFIG.TikTok)
end
end)
end)
end
