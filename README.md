--[[
DZ HUP | Toolbox (standalone)  -  Made by RiyadoDzz
Separate system: own window (TB button), own save file (DZHUP_Toolbox.json).
It does not touch the Name Maker, World or Creator systems.

- Store: Models / Decals / Meshes / Audio / Anims + Favorites + My IDs + Placed
- Insert by ID (a full link also works), search, sort, load more
- Items are placed in front of your camera, on the ground
- Script code is read from the asset file, and every script gets an SL_CodeTextBox
  (the box Studio Lite itself creates for its own scripts)
- Everything inserted is remembered and comes back after Play / reopen
- No backslash is used anywhere
]]
if not game:IsLoaded() then
	game.Loaded:Wait()
end
local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local UIS = game:GetService("UserInputService")
local HttpService = game:GetService("HttpService")
local player = Players.LocalPlayer
local genv = (type(getgenv) == "function" and getgenv()) or _G
if genv.DZHUP_TBCleanup then
	pcall(genv.DZHUP_TBCleanup)
end

local SAVE_FILE = "DZHUP_Toolbox.json"
local OLD_FILE = "DZHUP_NameMaker.json"
local UID_ATTR = "DZ_TB_UID"
local BASE = "https://apis.roblox.com/toolbox-service/v1/"
local PLACE_DISTANCE = 22
local NL = utf8.char(10)

local conns = {}
local function on(signal, fn)
	local c = signal:Connect(fn)
	conns[#conns + 1] = c
	return c
end

local T = {
	bg = Color3.fromRGB(14, 16, 23),
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
}

-- ============ small helpers ============
local hasFS = type(writefile) == "function" and type(readfile) == "function" and type(isfile) == "function"

local function copyText(text)
	local fn = setclipboard or toclipboard or set_clipboard
	if type(fn) == "function" then
		return (pcall(fn, text))
	end
	return false
end

local function trim(s)
	return (string.gsub(string.gsub(s, "^%s+", ""), "%s+$", ""))
end

local function placeKeyNow()
	local id = game.PlaceId
	if type(id) == "number" and id ~= 0 then
		return tostring(id)
	end
	local ok, n = pcall(function()
		return game.Name
	end)
	return "0|" .. tostring(ok and n or "project")
end

local function svc(name)
	return game:GetService(name)
end

-- ============ saved data ============
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

local save = { fav = {}, mine = {}, placed = {} }
local isNewFile = true
if hasFS and isfile(SAVE_FILE) then
	pcall(function()
		local d = HttpService:JSONDecode(readfile(SAVE_FILE))
		if type(d) == "table" then
			isNewFile = false
			for k in pairs(save) do
				if type(d[k]) == "table" then
					save[k] = d[k]
				end
			end
		end
	end)
end
if isNewFile and #save.mine == 0 then
	-- take the old My IDs list from the Name Maker file if it exists
	if hasFS and isfile(OLD_FILE) then
		pcall(function()
			local d = HttpService:JSONDecode(readfile(OLD_FILE))
			local old = d and d.settings and d.settings.toolboxV2
			if type(old) == "table" then
				if type(old.mine) == "table" then
					save.mine = old.mine
				end
				if type(old.fav) == "table" then
					save.fav = old.fav
				end
			end
		end)
	end
	if #save.mine == 0 then
		for _, line in ipairs(DEFAULTS) do
			local id, name = string.match(line, "^(%d+)|(.+)$")
			if id then
				table.insert(save.mine, { id = id, name = name, typeId = 10, creator = "My IDs" })
			end
		end
	end
end

local function persist()
	if hasFS then
		pcall(function()
			writefile(SAVE_FILE, HttpService:JSONEncode(save))
		end)
	end
end
persist()

local function records()
	local key = placeKeyNow()
	if type(save.placed[key]) ~= "table" then
		save.placed[key] = {}
	end
	return save.placed[key]
end

-- ============ http ============
local function httpGet(url)
	local req = genv.request or genv.http_request or (type(genv.syn) == "table" and genv.syn.request) or nil
	if type(req) == "function" then
		local ok, r = pcall(req, { Url = url, Method = "GET", Headers = { Accept = "application/json" } })
		if ok and type(r) == "table" and type(r.Body) == "string" and #r.Body > 0 and (r.StatusCode == nil or r.StatusCode == 200) then
			return r.Body
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
	return nil
end

local function getJson(url)
	local body = httpGet(url)
	if not body then
		return nil
	end
	local ok, d = pcall(function()
		return HttpService:JSONDecode(body)
	end)
	if ok and type(d) == "table" then
		return d
	end
	return nil
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
			local ok2, r = pcall(fn, { Url = url, Method = "GET" })
			if ok2 and type(r) == "table" and type(r.Body) == "string" and #r.Body > 40 and (r.StatusCode == nil or r.StatusCode == 200) then
				return r.Body
			end
		end
	end
	if type(genv.syn) == "table" and type(genv.syn.request) == "function" then
		local ok3, r = pcall(genv.syn.request, { Url = url, Method = "GET" })
		if ok3 and type(r) == "table" and type(r.Body) == "string" and #r.Body > 40 then
			return r.Body
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

-- ============ .rbxm reader (script code) ============
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
		return nil
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
		if pcall(method) then
			local ok, back = pcall(function()
				return inst.Source
			end)
			if not ok or back == src or (type(back) == "string" and #back > 0) then
				return true
			end
		end
	end
	return false
end

-- the box that Studio Lite keeps inside each of its own scripts
local function codeBox(inst, src)
	if type(src) ~= "string" or src == "" then
		return
	end
	if inst:FindFirstChild("SL_CodeTextBox") then
		return
	end
	pcall(function()
		local tb = Instance.new("TextBox")
		tb.Name = "SL_CodeTextBox"
		tb.Text = src
		tb.Size = UDim2.new(1, 0, 1, 0)
		tb.Position = UDim2.new(0, 52, 0, 0)
		tb.Font = Enum.Font.Code
		tb.TextSize = 14
		tb.MultiLine = true
		tb.ClearTextOnFocus = false
		tb.Parent = inst
	end)
end

local function applySources(objects, assetId)
	local body = downloadAsset(assetId)
	if not body then
		return 0, "the file could not be downloaded"
	end
	local ok, sources = pcall(parseRbxm, body)
	if not ok or type(sources) ~= "table" then
		return 0, "the file could not be read"
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
	local good, covered = 0, {}
	for key, src in pairs(sources) do
		local inst = idx[key]
		if inst and inst:IsA("LuaSourceContainer") then
			covered[inst] = true
			if setSource(inst, src) then
				good += 1
			end
			codeBox(inst, src)
		end
	end
	local decompileFn = genv.decompile or _G.decompile
	if type(decompileFn) == "function" then
		for _, inst in pairs(idx) do
			if inst:IsA("LuaSourceContainer") and not covered[inst] then
				local ok2, code = pcall(decompileFn, inst)
				if ok2 and type(code) == "string" and #code > 20 then
					setSource(inst, code)
					codeBox(inst, code)
					good += 1
				end
			end
		end
	end
	return good
end

-- ============ placing ============
local function flat(v)
	return Vector3.new(v.X, 0, v.Z)
end

local function findSpawn()
	local spawn = nil
	pcall(function()
		spawn = svc("Workspace"):FindFirstChildWhichIsA("SpawnLocation", true)
	end)
	return spawn and spawn.Position or Vector3.new(0, 0.5, 0)
end

local function viewBasis()
	local cam = svc("Workspace").CurrentCamera
	if cam then
		local cf = cam.CFrame
		local forward = flat(cf.LookVector)
		if forward.Magnitude < 0.3 then
			forward = flat(cf.UpVector)
		end
		if forward.Magnitude < 0.05 then
			forward = Vector3.new(0, 0, -1)
		end
		return cf.Position, forward.Unit
	end
	local root = player.Character and player.Character:FindFirstChild("HumanoidRootPart")
	if root then
		local forward = flat(root.CFrame.LookVector)
		if forward.Magnitude < 0.05 then
			forward = Vector3.new(0, 0, -1)
		end
		return root.Position, forward.Unit
	end
	return findSpawn() + Vector3.new(0, 10, 40), Vector3.new(0, 0, -1)
end

local function spawnPoint()
	local position, forward = viewBasis()
	local anchor = findSpawn()
	local target = position + forward * PLACE_DISTANCE
	local hit = nil
	pcall(function()
		local params = RaycastParams.new()
		params.FilterType = Enum.RaycastFilterType.Exclude
		if player.Character then
			params.FilterDescendantsInstances = { player.Character }
		end
		local startY = math.max(position.Y, anchor.Y) + 60
		hit = svc("Workspace"):Raycast(Vector3.new(target.X, startY, target.Z), Vector3.new(0, -800, 0), params)
	end)
	if hit then
		return hit.Position
	end
	return Vector3.new(target.X, anchor.Y, target.Z)
end

local function lowestBottom(root)
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
			local sx, sz, low = 0, 0, nil
			for _, r in ipairs(roots) do
				local center = r:IsA("Model") and (r:GetBoundingBox()) or r.CFrame
				sx += center.Position.X
				sz += center.Position.Z
				local b = lowestBottom(r)
				if b and (not low or b < low) then
					low = b
				end
			end
			local n = #roots
			low = low or (first:GetPivot().Position.Y - 2)
			local shift = Vector3.new(point.X - sx / n, (point.Y + 0.1) - low, point.Z - sz / n)
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

local function containers()
	local list = { svc("Workspace"), svc("Lighting"), svc("ServerScriptService"), svc("ReplicatedStorage"), svc("StarterGui"), svc("StarterPack"), svc("SoundService") }
	pcall(function()
		local starter = svc("StarterPlayer")
		for _, n in ipairs({ "StarterPlayerScripts", "StarterCharacterScripts" }) do
			local c = starter:FindFirstChild(n)
			if c then
				table.insert(list, c)
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

local function tag(root, rec)
	pcall(function()
		root:SetAttribute(UID_ATTR, rec.uid)
		root:SetAttribute("DZ_TB_ASSET", tostring(rec.id))
	end)
end

local function routeTarget(object)
	if object:IsA("LocalScript") then
		local sp = svc("StarterPlayer"):FindFirstChild("StarterPlayerScripts")
		if sp then
			return sp
		end
		return nil
	elseif object:IsA("Script") then
		local context = nil
		pcall(function()
			context = object.RunContext
		end)
		if context == Enum.RunContext.Client then
			return svc("ReplicatedStorage")
		end
		return svc("ServerScriptService")
	elseif object:IsA("ModuleScript") then
		return svc("ReplicatedStorage")
	elseif object:IsA("ScreenGui") then
		return svc("StarterGui")
	elseif object:IsA("Tool") or object:IsA("HopperBin") then
		return svc("StarterPack")
	elseif object:IsA("Sky") or object:IsA("Atmosphere") or object:IsA("Clouds") or object:IsA("PostEffect") then
		if object:IsA("Sky") then
			for _, child in ipairs(svc("Lighting"):GetChildren()) do
				if child:IsA("Sky") then
					child:Destroy()
				end
			end
		end
		return svc("Lighting")
	end
	return nil
end

local function loadAsset(assetId)
	for _ = 1, 3 do
		local list = nil
		pcall(function()
			local container = svc("InsertService"):LoadAsset(assetId)
			list = container:GetChildren()
			for _, o in ipairs(list) do
				o.Parent = nil
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

-- returns ok, message, firstInstance
local function createItem(rec, restoring)
	local assetId = tonumber(string.match(tostring(rec.id), "%d+"))
	if not assetId then
		return false, "Invalid asset id"
	end
	local t = rec.typeId
	local texture = "rbxassetid://" .. tostring(assetId)
	local ws = svc("Workspace")

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
		if not restoring then
			copyText(tostring(assetId))
		end
		return true, "Plugin ID copied", nil
	end

	if t == 24 then
		local a = Instance.new("Animation")
		a.Name = rec.name
		a.AnimationId = texture
		a.Parent = ws
		tag(a, rec)
		return true, "Animation added: " .. rec.name, a
	end

	if t == 3 then
		local s = Instance.new("Sound")
		s.Name = rec.name
		s.SoundId = texture
		s.Parent = ws
		tag(s, rec)
		return true, "Audio added: " .. rec.name, s
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
			for _, o in ipairs(objects) do
				if o:IsA("Decal") then
					decal = o
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
			mesh = svc("InsertService"):CreateMeshPartAsync(texture, Enum.CollisionFidelity.Box, Enum.RenderFidelity.Automatic)
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

	-- models: loaded like the real Toolbox, code restored, then moved in front of you
	local objects = loadAsset(assetId)
	if not objects then
		return false, "Could not load asset " .. tostring(assetId)
	end
	local good, note = applySources(objects, assetId)

	local hasSpatial = false
	for _, o in ipairs(objects) do
		if o:IsA("Model") or o:IsA("BasePart") then
			hasSpatial = true
		end
	end

	local roots, loose, routed = {}, {}, {}
	local firstRouted = nil
	for _, o in ipairs(objects) do
		local target = nil
		if not (hasSpatial and o:IsA("LuaSourceContainer")) then
			target = routeTarget(o)
		end
		if target then
			o.Parent = target
			makeSaveable(o)
			tag(o, rec)
			firstRouted = firstRouted or o
			table.insert(routed, o.Name .. " > " .. target.Name)
		elseif o:IsA("Model") or o:IsA("BasePart") then
			table.insert(roots, o)
		else
			table.insert(loose, o)
		end
	end

	if #roots == 0 then
		for _, o in ipairs(loose) do
			o.Parent = ws
			makeSaveable(o)
			tag(o, rec)
			firstRouted = firstRouted or o
		end
		if not firstRouted then
			return false, "The asset is empty"
		end
		return true, "Placed: " .. (#routed > 0 and table.concat(routed, ", ") or "Workspace"), firstRouted
	end

	for _, o in ipairs(loose) do
		if roots[1]:IsA("Model") then
			o.Parent = roots[1]
		else
			table.insert(roots, o)
		end
	end

	local spatial, scriptCount = {}, 0
	for _, r in ipairs(roots) do
		if r:IsA("Model") or r:IsA("BasePart") then
			table.insert(spatial, r)
		end
		if r:IsA("LuaSourceContainer") then
			scriptCount += 1
		end
		for _, d in ipairs(r:GetDescendants()) do
			if d:IsA("LuaSourceContainer") then
				scriptCount += 1
			end
		end
	end

	placeRoots(spatial, cf)
	for _, r in ipairs(roots) do
		if not r.Parent then
			r.Parent = ws
		end
		tag(r, rec)
	end

	local message = "Inserted: " .. rec.name
	if scriptCount > 0 then
		if good > 0 then
			message = message .. " (" .. good .. " scripts with code)"
		else
			message = message .. " (script code not read: " .. tostring(note or "unknown") .. ")"
		end
	end
	if #routed > 0 then
		message = message .. " + " .. table.concat(routed, ", ")
	end
	return true, message, spatial[1]
end

-- ============ store data ============
local CATS = {
	{ title = "Models", typeId = 10 },
	{ title = "Decals", typeId = 13 },
	{ title = "Meshes", typeId = 4 },
	{ title = "Audio", typeId = 3 },
	{ title = "Anims", typeId = 24 },
	{ title = "Favorites", kind = "fav" },
	{ title = "My IDs", kind = "mine" },
	{ title = "Placed", kind = "placed" },
}
local SORTS = { { "Relevance", 1 }, { "Most used", 2 }, { "Favorited", 3 }, { "Newest", 4 }, { "Top rated", 5 } }
local ID_TYPES = { { "Auto", "auto" }, { "Model", 10 }, { "Decal", 13 }, { "Mesh", 4 }, { "Audio", 3 }, { "Anim", 24 }, { "Sky", "sky" } }
local TYPE_MAP = { [1] = 13, [3] = 3, [4] = 4, [10] = 10, [13] = 13, [24] = 24, [32] = 10, [38] = 38 }
local TYPE_NAMES = { [10] = "Model", [13] = "Decal", [4] = "Mesh", [3] = "Audio", [24] = "Anim", [38] = "Plugin", sky = "Sky" }

local catIndex, sortIndex, idTypeIndex = 1, 1, 1
local keyword = ""
local items, cursor = {}, nil
local loading, loadError = false, nil
local requestToken = 0
local history = {}
local render

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

local function insertNew(item)
	local rec = {
		uid = newUid(),
		id = tostring(item.id),
		name = tostring(item.name),
		typeId = item.typeId,
		creator = tostring(item.creator or ""),
		desc = tostring(item.desc or ""),
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

local restoring = false
local function restoreAll()
	if restoring then
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

local function fetchStore(cat, token)
	local url = BASE .. "marketplace/" .. cat.typeId .. "?limit=30&pageNumber=0&sortType=" .. SORTS[sortIndex][2]
	if keyword ~= "" then
		url = url .. "&keyword=" .. HttpService:UrlEncode(keyword)
	end
	if cursor and cursor ~= "" then
		url = url .. "&cursor=" .. HttpService:UrlEncode(cursor)
	end
	local data = getJson(url)
	if token ~= requestToken then
		return
	end
	if not data then
		loading = false
		loadError = "Could not reach the store"
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

local function refresh(reset)
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

-- ============ interface ============
local function new(cls, props, parent)
	local o = Instance.new(cls)
	for k, v in pairs(props) do
		o[k] = v
	end
	o.Parent = parent
	return o
end
local function corner(p, r)
	return new("UICorner", { CornerRadius = UDim.new(0, r) }, p)
end
local function stroke(p, c, t, th)
	return new("UIStroke", { Color = c, Transparency = t, Thickness = th or 1, ApplyStrokeMode = Enum.ApplyStrokeMode.Border }, p)
end
local function tween(o, d, goal)
	TweenService:Create(o, TweenInfo.new(d, Enum.EasingStyle.Quad, Enum.EasingDirection.Out), goal):Play()
end
local function label(p, text, props)
	props.BackgroundTransparency = 1
	props.Text = text
	props.Font = props.Font or Enum.Font.GothamBold
	props.TextColor3 = props.TextColor3 or T.text
	props.TextSize = props.TextSize or 14
	props.TextXAlignment = props.TextXAlignment or Enum.TextXAlignment.Left
	return new("TextLabel", props, p)
end
local function button(p, text, props, fill, color)
	props.Text = text
	props.BackgroundColor3 = fill or T.surface2
	props.AutoButtonColor = true
	props.BorderSizePixel = 0
	props.Font = props.Font or Enum.Font.GothamBold
	props.TextColor3 = color or T.text
	props.TextSize = props.TextSize or 14
	local b = new("TextButton", props, p)
	corner(b, 8)
	return b
end
local function field(p, x, y, w, h, placeholder)
	local box = new("TextBox", {
		Position = UDim2.fromOffset(x, y),
		Size = UDim2.fromOffset(w, h),
		BackgroundColor3 = T.field,
		BorderSizePixel = 0,
		ClearTextOnFocus = false,
		PlaceholderText = placeholder,
		PlaceholderColor3 = T.muted,
		Text = "",
		TextColor3 = T.text,
		TextSize = 14,
		Font = Enum.Font.GothamBold,
		TextXAlignment = Enum.TextXAlignment.Left,
		TextTruncate = Enum.TextTruncate.AtEnd,
	}, p)
	corner(box, 8)
	new("UIPadding", { PaddingLeft = UDim.new(0, 8), PaddingRight = UDim.new(0, 8) }, box)
	stroke(box, T.line, 0.35, 1)
	return box
end

local guiParent
do
	local ok, hui = pcall(function()
		return type(gethui) == "function" and gethui() or nil
	end)
	guiParent = (ok and hui) or player:WaitForChild("PlayerGui")
end
pcall(function()
	for _, c in ipairs(guiParent:GetChildren()) do
		if c.Name == "DZHUP_Toolbox" then
			c:Destroy()
		end
	end
end)

local PW, PH = 520, 384
local gui = new("ScreenGui", { Name = "DZHUP_Toolbox", ResetOnSpawn = false, IgnoreGuiInset = true, DisplayOrder = 998, ZIndexBehavior = Enum.ZIndexBehavior.Sibling }, guiParent)

local openButton = button(gui, "TB", {
	AnchorPoint = Vector2.new(0, 0.5),
	Position = UDim2.new(0, 12, 0.5, 60),
	Size = UDim2.fromOffset(44, 44),
	TextSize = 16,
	Font = Enum.Font.GothamBlack,
	BackgroundTransparency = 0.4,
}, T.header, T.accent)
corner(openButton, 22)
stroke(openButton, T.accent, 0.6, 1)

local holder = new("Frame", { Size = UDim2.fromOffset(PW, PH), BackgroundTransparency = 1, Visible = false }, gui)
local scaler = new("UIScale", { Scale = 1 }, holder)
local panel = new("Frame", { Size = UDim2.fromScale(1, 1), BackgroundColor3 = T.bg, BorderSizePixel = 0, ClipsDescendants = true }, holder)
corner(panel, 14)
stroke(panel, T.line, 0.2, 1.2)

local header = new("Frame", { Size = UDim2.new(1, 0, 0, 40), BackgroundColor3 = T.header, BorderSizePixel = 0, Active = true }, panel)
label(header, "DZ HUP  Toolbox", { Position = UDim2.fromOffset(14, 0), Size = UDim2.new(1, -70, 1, 0), Font = Enum.Font.GothamBlack, TextSize = 16 })
local closeButton = button(header, "X", {
	AnchorPoint = Vector2.new(1, 0.5),
	Position = UDim2.new(1, -8, 0.5, 0),
	Size = UDim2.fromOffset(30, 28),
	Font = Enum.Font.GothamBlack,
	TextSize = 14,
}, T.surface, T.muted)

local toastLabel = label(panel, "", {
	AnchorPoint = Vector2.new(0.5, 1),
	Position = UDim2.new(0.5, 0, 1, -6),
	Size = UDim2.new(1, -24, 0, 24),
	TextXAlignment = Enum.TextXAlignment.Center,
	TextSize = 13,
	TextTruncate = Enum.TextTruncate.AtEnd,
	BackgroundTransparency = 0.05,
	BackgroundColor3 = T.header,
	ZIndex = 30,
	Visible = false,
})
corner(toastLabel, 8)
local toastToken = 0
local function toast(msg, good)
	toastToken += 1
	local mine = toastToken
	toastLabel.Text = tostring(msg)
	toastLabel.TextColor3 = good and T.success or T.danger
	toastLabel.Visible = true
	task.delay(3.5, function()
		if mine == toastToken then
			toastLabel.Visible = false
		end
	end)
end

local function placeWindow()
	local v = gui.AbsoluteSize
	scaler.Scale = math.clamp(math.min(v.X * 0.94 / PW, v.Y * 0.88 / PH), 0.4, 1.25)
	holder.Position = UDim2.fromOffset(math.max(0, (v.X - PW * scaler.Scale) / 2), math.max(0, (v.Y - PH * scaler.Scale) / 2))
end
placeWindow()

-- sidebar
local side = new("Frame", { Position = UDim2.fromOffset(8, 48), Size = UDim2.fromOffset(104, 300), BackgroundColor3 = T.surface, BorderSizePixel = 0 }, panel)
corner(side, 10)
stroke(side, T.line, 0.5, 1)
local sideList = new("Frame", { Position = UDim2.fromOffset(6, 6), Size = UDim2.new(1, -12, 1, -12), BackgroundTransparency = 1 }, side)
new("UIListLayout", { Padding = UDim.new(0, 3), SortOrder = Enum.SortOrder.LayoutOrder }, sideList)
local chips = {}
for index, cat in ipairs(CATS) do
	local b = button(sideList, cat.title, { Size = UDim2.new(1, 0, 0, 31), LayoutOrder = index, TextSize = 13, Font = Enum.Font.GothamBlack }, T.surface, T.text)
	b.BackgroundTransparency = 1
	chips[index] = b
	b.Activated:Connect(function()
		catIndex = index
		if cat.typeId then
			refresh(true)
		else
			render()
		end
	end)
end

-- main area
local main = new("Frame", { Position = UDim2.fromOffset(118, 48), Size = UDim2.fromOffset(394, 300), BackgroundTransparency = 1 }, panel)
local searchBox = field(main, 0, 0, 170, 30, "Search the store...")
local sortButton = button(main, SORTS[1][1], { Position = UDim2.fromOffset(176, 0), Size = UDim2.fromOffset(80, 30), TextSize = 12 })
local undoButton = button(main, "Undo", { Position = UDim2.fromOffset(262, 0), Size = UDim2.fromOffset(60, 30), TextSize = 13 }, T.surface, T.accent)
local clearButton = button(main, "Clear", { Position = UDim2.fromOffset(328, 0), Size = UDim2.fromOffset(66, 30), TextSize = 13 }, T.surface, T.danger)

local idBox = field(main, 0, 36, 150, 30, "Paste asset ID or link")
local typeButton = button(main, "Type: Auto", { Position = UDim2.fromOffset(156, 36), Size = UDim2.fromOffset(94, 30), TextSize = 12 })
local idInsert = button(main, "Insert", { Position = UDim2.fromOffset(256, 36), Size = UDim2.fromOffset(72, 30), TextSize = 14, Font = Enum.Font.GothamBlack }, T.accent, T.dark)
local idSave = button(main, "Save", { Position = UDim2.fromOffset(334, 36), Size = UDim2.fromOffset(60, 30), TextSize = 14 }, T.surface, T.accent)

local grid = new("ScrollingFrame", {
	Position = UDim2.fromOffset(0, 72),
	Size = UDim2.fromOffset(394, 228),
	BackgroundColor3 = T.field,
	BorderSizePixel = 0,
	ScrollBarThickness = 4,
	CanvasSize = UDim2.new(),
	AutomaticCanvasSize = Enum.AutomaticSize.Y,
	ScrollingDirection = Enum.ScrollingDirection.Y,
}, main)
corner(grid, 10)
stroke(grid, T.line, 0.5, 1)
new("UIPadding", { PaddingTop = UDim.new(0, 6), PaddingBottom = UDim.new(0, 6), PaddingLeft = UDim.new(0, 6), PaddingRight = UDim.new(0, 8) }, grid)
new("UIGridLayout", { CellSize = UDim2.fromOffset(120, 150), CellPadding = UDim2.fromOffset(6, 6), SortOrder = Enum.SortOrder.LayoutOrder }, grid)
local statusLabel = label(main, "", {
	Position = UDim2.fromOffset(0, 72),
	Size = UDim2.fromOffset(394, 228),
	TextWrapped = true,
	TextSize = 15,
	TextColor3 = T.muted,
	TextXAlignment = Enum.TextXAlignment.Center,
	Visible = false,
})

local function countOf(tbl)
	local n = 0
	for _ in pairs(tbl) do
		n += 1
	end
	return n
end

local function paintChips()
	for i, b in ipairs(chips) do
		local active = i == catIndex
		b.BackgroundTransparency = active and 0 or 1
		b.TextColor3 = active and T.accent or T.text
		local cat = CATS[i]
		local extra = ""
		if cat.kind == "fav" then
			extra = " (" .. countOf(save.fav) .. ")"
		elseif cat.kind == "mine" then
			extra = " (" .. #save.mine .. ")"
		elseif cat.kind == "placed" then
			extra = " (" .. #records() .. ")"
		end
		b.Text = cat.title .. extra
	end
end

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

local function doInsert(item, btn, text)
	if btn:GetAttribute("Busy") then
		return
	end
	btn:SetAttribute("Busy", true)
	btn.Text = "..."
	toast("Loading... please wait", true)
	task.spawn(function()
		local ok, success, message = pcall(insertNew, item)
		if not ok then
			message = tostring(success)
			success = false
		end
		toast(message, success)
		paintChips()
		if btn.Parent then
			btn.Text = success and "Done" or "Failed"
			task.wait(1.2)
		end
		if btn.Parent then
			btn.Text = text
			btn:SetAttribute("Busy", nil)
		end
	end)
end

local STAR_ON, STAR_OFF = utf8.char(0x2605), utf8.char(0x2606)

local function cardBase(item, index, missing)
	local card = new("Frame", { BackgroundColor3 = T.surface, BorderSizePixel = 0, LayoutOrder = index }, grid)
	corner(card, 10)
	stroke(card, T.line, 0.6, 1)
	local thumb = new("ImageButton", {
		Position = UDim2.fromOffset(5, 5),
		Size = UDim2.fromOffset(110, 74),
		BackgroundColor3 = T.field,
		BorderSizePixel = 0,
		ScaleType = Enum.ScaleType.Fit,
		AutoButtonColor = false,
		Image = "rbxthumb://type=Asset&id=" .. tostring(item.id) .. "&w=150&h=150",
	}, card)
	corner(thumb, 8)
	thumb.Activated:Connect(function()
		if copyText(tostring(item.id)) then
			toast("ID copied: " .. tostring(item.id), true)
		else
			toast("ID: " .. tostring(item.id), false)
		end
	end)
	local tagText = missing and "Missing" or (TYPE_NAMES[item.typeId] or "Item")
	local tagBox = new("Frame", { AnchorPoint = Vector2.new(1, 0), Position = UDim2.new(1, -3, 0, 3), Size = UDim2.fromOffset(#tagText * 7 + 12, 16), BackgroundColor3 = T.header, BackgroundTransparency = 0.15, BorderSizePixel = 0 }, thumb)
	corner(tagBox, 5)
	label(tagBox, tagText, { Size = UDim2.fromScale(1, 1), Font = Enum.Font.GothamBlack, TextSize = 10, TextColor3 = missing and T.danger or T.accent, TextXAlignment = Enum.TextXAlignment.Center })
	label(card, tostring(item.name), { Position = UDim2.fromOffset(7, 82), Size = UDim2.new(1, -14, 0, 16), Font = Enum.Font.GothamBlack, TextSize = 13, TextTruncate = Enum.TextTruncate.AtEnd })
	local creator = tostring(item.creator or "")
	label(card, (creator ~= "" and creator or "Unknown") .. " | " .. tostring(item.id), { Position = UDim2.fromOffset(7, 99), Size = UDim2.new(1, -14, 0, 12), TextSize = 10, TextColor3 = T.muted, TextTruncate = Enum.TextTruncate.AtEnd })
	return card
end

local function toggleFav(item)
	if save.fav[item.id] ~= nil then
		save.fav[item.id] = nil
	else
		save.fav[item.id] = { id = item.id, name = item.name, typeId = item.typeId, creator = item.creator, desc = item.desc }
	end
	persist()
	paintChips()
	return save.fav[item.id] ~= nil
end

local function buildItemCard(item, index, canDelete)
	local card = cardBase(item, index, false)
	local width = canDelete and 62 or 86
	local text = actionLabel(item)
	local insertBtn = button(card, text, { Position = UDim2.fromOffset(5, 118), Size = UDim2.fromOffset(width, 26), TextSize = 13, Font = Enum.Font.GothamBlack }, T.accent, T.dark)
	local isFav = save.fav[item.id] ~= nil
	local favBtn = button(card, isFav and STAR_ON or STAR_OFF, { Position = UDim2.fromOffset(5 + width + 4, 118), Size = UDim2.fromOffset(26, 26), TextSize = 16 }, T.surface2, isFav and T.accent or T.muted)
	insertBtn.Activated:Connect(function()
		doInsert(item, insertBtn, text)
	end)
	favBtn.Activated:Connect(function()
		local now = toggleFav(item)
		if CATS[catIndex].kind == "fav" then
			render()
			return
		end
		favBtn.Text = now and STAR_ON or STAR_OFF
		favBtn.TextColor3 = now and T.accent or T.muted
	end)
	if canDelete then
		local del = button(card, "X", { Position = UDim2.fromOffset(5 + width + 34, 118), Size = UDim2.fromOffset(26, 26), TextSize = 13 }, T.surface2, T.danger)
		local armed = false
		del.Activated:Connect(function()
			if not armed then
				armed = true
				del.Text = "?"
				task.delay(2.5, function()
					if armed and del.Parent then
						armed = false
						del.Text = "X"
					end
				end)
				return
			end
			for i, entry in ipairs(save.mine) do
				if tostring(entry.id) == item.id then
					table.remove(save.mine, i)
					break
				end
			end
			persist()
			render()
			toast("Removed from My IDs", true)
		end)
	end
end

local function buildPlacedCard(rec, index, idx)
	local inst = idx[rec.uid] and idx[rec.uid][1] or nil
	local card = cardBase(rec, index, inst == nil and rec.typeId ~= 38)
	local selectBtn = button(card, inst and "Select" or "Restore", { Position = UDim2.fromOffset(5, 118), Size = UDim2.fromOffset(56, 26), TextSize = 12, Font = Enum.Font.GothamBlack }, T.accent, T.dark)
	local goBtn = button(card, "Go", { Position = UDim2.fromOffset(65, 118), Size = UDim2.fromOffset(30, 26), TextSize = 13 }, T.surface2, T.accent)
	local delBtn = button(card, "X", { Position = UDim2.fromOffset(99, 118), Size = UDim2.fromOffset(16, 26), TextSize = 12 }, T.surface2, T.danger)
	selectBtn.Activated:Connect(function()
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
			svc("Selection"):Set(targets)
		end)
		toast("Selected: " .. rec.name, true)
	end)
	goBtn.Activated:Connect(function()
		local target = findAll(rec.uid)[1]
		if not target then
			toast("Missing. Tap Restore first.", false)
			return
		end
		local ok = pcall(function()
			local p = target:GetPivot().Position
			svc("Workspace").CurrentCamera.CFrame = CFrame.lookAt(p + Vector3.new(0, 12, 24), p)
		end)
		toast(ok and ("Camera moved to " .. rec.name) or "No position", ok)
	end)
	local armed = false
	delBtn.Activated:Connect(function()
		if not armed then
			armed = true
			delBtn.Text = "?"
			task.delay(2.5, function()
				if armed and delBtn.Parent then
					armed = false
					delBtn.Text = "X"
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
	local q = string.lower(keyword)
	for _, e in ipairs(entries) do
		local name, id = tostring(e.name), tostring(e.id)
		if q == "" or string.find(string.lower(name), q, 1, true) or string.find(id, q, 1, true) then
			table.insert(list, { id = id, name = name, typeId = e.typeId, creator = tostring(e.creator or ""), desc = tostring(e.desc or ""), rec = e })
		end
	end
	return list
end

render = function()
	for _, c in ipairs(grid:GetChildren()) do
		if c:IsA("GuiObject") then
			c:Destroy()
		end
	end
	paintChips()
	local cat = CATS[catIndex]
	local kind = cat.kind
	local list = items
	if kind == "fav" then
		local entries = {}
		for _, e in pairs(save.fav) do
			table.insert(entries, e)
		end
		table.sort(entries, function(a, b)
			return string.lower(tostring(a.name)) < string.lower(tostring(b.name))
		end)
		list = localList(entries)
	elseif kind == "mine" then
		list = localList(save.mine)
	elseif kind == "placed" then
		list = localList(records())
	end
	if #list == 0 then
		grid.Visible = false
		statusLabel.Visible = true
		if loading then
			statusLabel.Text = "Loading from the store..."
		elseif loadError then
			statusLabel.Text = loadError .. NL .. "Check that your executor allows HTTP, then tap the category again."
		elseif kind == "fav" then
			statusLabel.Text = "No favorites yet" .. NL .. "Tap the star on any item"
		elseif kind == "mine" then
			statusLabel.Text = "Nothing saved" .. NL .. "Paste an asset ID above and tap Save"
		elseif kind == "placed" then
			statusLabel.Text = "Nothing placed yet" .. NL .. "Inserted items are listed here and come back after Play"
		else
			statusLabel.Text = "No results" .. NL .. "Try another search"
		end
		return
	end
	statusLabel.Visible = false
	grid.Visible = true
	local idx = kind == "placed" and buildIndex() or nil
	for i, item in ipairs(list) do
		if kind == "placed" then
			buildPlacedCard(item.rec, i, idx)
		else
			buildItemCard(item, i, kind == "mine")
		end
	end
	if cat.typeId and (cursor or loading or loadError) then
		local more = button(grid, loading and "Loading..." or (loadError and "Retry" or "Load more"), { LayoutOrder = 99999, TextSize = 14, Font = Enum.Font.GothamBlack }, T.surface, T.accent)
		more.Activated:Connect(function()
			if not loading then
				refresh(false)
			end
		end)
	end
end

-- search / sort / undo / clear
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

sortButton.Activated:Connect(function()
	sortIndex = sortIndex % #SORTS + 1
	sortButton.Text = SORTS[sortIndex][1]
	if CATS[catIndex].typeId then
		refresh(true)
	end
end)

undoButton.Activated:Connect(function()
	while #history > 0 do
		local uid = table.remove(history)
		for _, rec in ipairs(records()) do
			if rec.uid == uid then
				local name = rec.name
				removeRecord(rec)
				persist()
				render()
				toast("Removed: " .. name, true)
				return
			end
		end
	end
	toast("Nothing to undo", false)
end)

local clearArmed = false
clearButton.Activated:Connect(function()
	if not clearArmed then
		clearArmed = true
		clearButton.Text = "Sure?"
		task.delay(2.5, function()
			if clearArmed and clearButton.Parent then
				clearArmed = false
				clearButton.Text = "Clear"
			end
		end)
		return
	end
	clearArmed = false
	clearButton.Text = "Clear"
	local n = 0
	for _, rec in ipairs(table.clone(records())) do
		removeRecord(rec)
		n += 1
	end
	table.clear(history)
	persist()
	render()
	toast(n == 0 and "Nothing to clear" or ("Removed " .. n .. " inserted items"), n > 0)
end)

-- insert / save by id
typeButton.Activated:Connect(function()
	idTypeIndex = idTypeIndex % #ID_TYPES + 1
	typeButton.Text = "Type: " .. ID_TYPES[idTypeIndex][1]
end)

local idBusy = false
local function readId()
	local id = string.match(idBox.Text, "%d+")
	if not id then
		toast("Paste a valid asset ID", false)
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
	toast("Loading... please wait", true)
	task.spawn(function()
		local item = resolveItem(id)
		local ok, success, message = pcall(insertNew, item)
		if not ok then
			message = tostring(success)
			success = false
		end
		toast(message, success)
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
	for _, e in ipairs(save.mine) do
		if tostring(e.id) == id then
			toast("Already in My IDs", false)
			return
		end
	end
	idBusy = true
	idSave.Text = "..."
	task.spawn(function()
		local item = resolveItem(id)
		table.insert(save.mine, { id = id, name = item.name, typeId = item.typeId, creator = item.creator ~= "" and item.creator or "My IDs", desc = item.desc })
		persist()
		if CATS[catIndex].kind == "mine" then
			render()
		else
			paintChips()
		end
		toast("Saved to My IDs: " .. item.name, true)
		if idSave.Parent then
			idSave.Text = "Save"
		end
		idBusy = false
	end)
end)

-- open / close / drag
local isOpen, loadedOnce = false, false
local function setOpen(open)
	isOpen = open
	holder.Visible = open
	openButton.Visible = not open
	if open then
		placeWindow()
		if not loadedOnce then
			loadedOnce = true
			refresh(true)
		else
			render()
		end
	end
end
openButton.Activated:Connect(function()
	setOpen(true)
end)
closeButton.Activated:Connect(function()
	setOpen(false)
end)

local function isPointer(input)
	return input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch
end
local dragging = false
local dragStart, startPos = Vector2.zero, Vector2.zero
header.InputBegan:Connect(function(input)
	if isPointer(input) then
		dragging = true
		dragStart = Vector2.new(input.Position.X, input.Position.Y)
		startPos = Vector2.new(holder.Position.X.Offset, holder.Position.Y.Offset)
	end
end)
on(UIS.InputChanged, function(input)
	if dragging and (input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch) then
		local d = Vector2.new(input.Position.X, input.Position.Y) - dragStart
		local v = gui.AbsoluteSize
		local x = math.clamp(startPos.X + d.X, 0, math.max(0, v.X - PW * scaler.Scale))
		local y = math.clamp(startPos.Y + d.Y, 0, math.max(0, v.Y - PH * scaler.Scale))
		holder.Position = UDim2.fromOffset(x, y)
	end
end)
on(UIS.InputEnded, function(input)
	if isPointer(input) then
		dragging = false
	end
end)

genv.DZHUP_TBCleanup = function()
	for _, c in ipairs(conns) do
		pcall(function()
			c:Disconnect()
		end)
	end
	pcall(function()
		gui:Destroy()
	end)
end

render()

-- bring back everything inserted earlier (after Play mode / reopen)
task.spawn(function()
	task.wait(2.5)
	local n = restoreAll()
	if n > 0 then
		toast("Toolbox restored " .. n .. " items", true)
	end
	paintChips()
end)
print("[DZHUP] Toolbox ready (tap TB)")
