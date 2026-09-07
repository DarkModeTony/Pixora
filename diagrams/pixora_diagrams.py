"""
Pixora AI Studio -- System Diagrams
Generates 5 high-quality PNG diagrams:
  1. ER Diagram
  2. Database Tables Reference
  3. AI Generation Flow
  4. Payment Flow
  5. Full System Architecture
Run: python diagrams/pixora_diagrams.py
"""
import os
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.patheffects as pe
from matplotlib.patches import FancyBboxPatch

OUT_DIR = os.path.dirname(os.path.abspath(__file__))

BG      = "#0f0f1a"
CARD    = "#1a1a2e"
BORDER  = "#2d2d4e"
A1      = "#9333ea"   # purple
A2      = "#ec4899"   # pink
A3      = "#06b6d4"   # cyan
A4      = "#f59e0b"   # amber
A5      = "#10b981"   # emerald
A6      = "#f97316"   # orange
TH      = "#f8fafc"
TB      = "#cbd5e1"
TD      = "#64748b"
WH      = "#ffffff"

matplotlib.rcParams.update({
    "font.family": "DejaVu Sans",
    "figure.facecolor": BG,
    "axes.facecolor": BG,
})

def save(name):
    out = os.path.join(OUT_DIR, name)
    plt.savefig(out, dpi=155, bbox_inches="tight", facecolor=BG)
    plt.close()
    print(f"  Saved: {out}")

def title_ax(ax, title, sub, accent):
    ax.text(0.5, 0.98, title, ha="center", va="top",
            transform=ax.transAxes, fontsize=17, fontweight="bold",
            color=TH, path_effects=[pe.withStroke(linewidth=3, foreground=accent)])
    ax.text(0.5, 0.94, sub, ha="center", va="top",
            transform=ax.transAxes, fontsize=9, color=TD)

def fbox(ax, x, y, w, h, ec, fc=None, lw=1.6, zorder=2, alpha=1.0, rad="round,pad=0.07"):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=rad,
        linewidth=lw, edgecolor=ec, facecolor=fc or CARD,
        alpha=alpha, zorder=zorder))

def hdr(ax, x, y, w, h, hh, color, text, fs=9):
    fbox(ax, x, y, w, h, color)
    fbox(ax, x, y+h-hh, w, hh, color, fc=color, lw=0, zorder=3, alpha=0.88)
    ax.text(x+w/2, y+h-hh/2, text, ha="center", va="center",
            fontsize=fs, fontweight="bold", color=WH, zorder=4)

def arr(ax, x1, y1, x2, y2, label="", color=A3, lw=1.7, rad=0.0, fs=7.5):
    ax.annotate("", xy=(x2,y2), xytext=(x1,y1),
        arrowprops=dict(arrowstyle="->, head_width=0.28",
                        color=color, lw=lw,
                        connectionstyle=f"arc3,rad={rad}"), zorder=6)
    if label:
        mx,my=(x1+x2)/2,(y1+y2)/2
        ax.text(mx+0.08,my+0.1,label,ha="center",va="center",fontsize=fs,
                color=color,fontweight="bold",zorder=7,
                bbox=dict(boxstyle="round,pad=0.18",facecolor=BG,
                          edgecolor=color,linewidth=0.7,alpha=0.92))

# ==============================================================
# DIAGRAM 1 - ER Diagram
# ==============================================================
def draw_er():
    fig,ax=plt.subplots(figsize=(22,15))
    fig.patch.set_facecolor(BG); ax.set_facecolor(BG)
    ax.set_xlim(0,22); ax.set_ylim(0,15); ax.axis("off")
    title_ax(ax,"PIXORA — Entity Relationship Diagram",
             "InsForge PostgreSQL schema: all 6 tables with relationships",A1)

    def ent(x,y,w,h,name,pk,attrs,color):
        fbox(ax,x,y,w,h,color,zorder=2)
        fbox(ax,x,y+h-0.52,w,0.52,color,fc=color,lw=0,zorder=3,alpha=0.88)
        ax.text(x+w/2,y+h-0.26,name,ha="center",va="center",
                fontsize=9.5,fontweight="bold",color=WH,zorder=4)
        ax.text(x+0.15,y+h-0.75,f"PK  {pk}",ha="left",va="center",
                fontsize=7.8,color=A4,fontstyle="italic",zorder=4)
        for i,(col,typ) in enumerate(attrs):
            cy=y+h-1.1-i*0.37
            ax.text(x+0.15,cy,col,ha="left",va="center",fontsize=8,color=TB,zorder=4)
            ax.text(x+w-0.1,cy,typ,ha="right",va="center",fontsize=7.2,
                    color=TD,fontstyle="italic",zorder=4)
            if i<len(attrs)-1:
                ax.plot([x+0.08,x+w-0.08],[cy-0.17,cy-0.17],
                        color=BORDER,lw=0.4,zorder=3)

    def rel(x1,y1,x2,y2,lbl,color=A3,lw=2):
        arr(ax,x1,y1,x2,y2,lbl,color,lw,0.04)

    # auth.users
    ent(0.3,10.1,4.0,3.3,"auth.users  (InsForge)","id UUID",[
        ("email","TEXT"),("encrypted_password","TEXT"),
        ("profile","JSONB"),("created_at","TIMESTAMPTZ")],A3)
    # public.users
    ent(5.5,8.6,5.3,5.0,"public.users","id UUID -> auth.users",[
        ("email","TEXT"),("name","TEXT"),("avatar_url","TEXT"),
        ("credits","INTEGER default 50"),("plan","free|basic|pro"),
        ("plan_expires_at","TIMESTAMPTZ"),("plan_credits_per_month","INTEGER"),
        ("subscription_rzp_order_id","TEXT"),
        ("created_at","TIMESTAMPTZ"),("updated_at","TIMESTAMPTZ")],A1)
    # public.generations
    ent(5.5,0.3,5.3,7.5,"public.generations","id UUID",[
        ("user_id","UUID FK -> auth.users"),("tool","TEXT NOT NULL"),
        ("source_image_url","TEXT NOT NULL"),
        ("reference_image_url","TEXT"),
        ("result_image_url","TEXT NOT NULL"),
        ("storage_key","TEXT"),("options","JSONB"),
        ("credits_used","INTEGER default 5"),
        ("created_at","TIMESTAMPTZ")],A5)
    # sub_history
    ent(12.3,8.6,5.4,5.0,"public.subscription_history","id UUID",[
        ("user_id","UUID FK -> auth.users"),("plan","TEXT"),
        ("amount_paise","INTEGER"),("razorpay_order_id","TEXT"),
        ("razorpay_payment_id","TEXT"),
        ("status","pending|paid|failed"),
        ("created_at","TIMESTAMPTZ"),("paid_at","TIMESTAMPTZ")],A2)
    # razorpay_orders
    ent(12.3,0.3,5.4,7.5,"payments.razorpay_orders","id UUID",[
        ("subject_type","TEXT 'user'"),("subject_id","TEXT -> user.id"),
        ("provider","TEXT 'razorpay'"),("provider_event_id","TEXT"),
        ("event_type","TEXT"),("processing_status","TEXT"),
        ("payload","JSONB"),("amount","INTEGER paise"),
        ("currency","TEXT INR"),("notes","JSONB"),
        ("created_at","TIMESTAMPTZ")],A6)
    # webhook_events
    ent(18.5,9.0,3.2,4.0,"payments.webhook_events","id UUID",[
        ("provider","TEXT"),("event_type","TEXT"),
        ("processing_status","TEXT"),
        ("payload","JSONB"),("created_at","TIMESTAMPTZ")],A4)

    # relationships
    rel(4.3,12.0,5.5,12.0,"1:1 trigger",A3,2.2)
    rel(8.2,8.6,8.2,7.8,"1:N",A5,2)
    rel(10.8,10.8,12.3,10.8,"1:N",A2,2)
    arr(ax,18.5,10.6,17.5,10.6,"trigger",A4,1.8,-0.2)
    arr(ax,18.5,11.0,11.2,9.8,"webhook\nfulfills plan",A4,1.5,0.25,6.5)

    legend_items=[
        mpatches.Patch(color=A3,label="auth.users (InsForge)"),
        mpatches.Patch(color=A1,label="public.users"),
        mpatches.Patch(color=A5,label="public.generations"),
        mpatches.Patch(color=A2,label="public.subscription_history"),
        mpatches.Patch(color=A6,label="payments.razorpay_orders"),
        mpatches.Patch(color=A4,label="payments.webhook_events"),
    ]
    ax.legend(handles=legend_items,loc="lower left",
              facecolor=CARD,edgecolor=BORDER,labelcolor=TB,fontsize=8.5)
    save("pixora_er_diagram.png")

# ==============================================================
# DIAGRAM 2 - DB Tables
# ==============================================================
def draw_tables():
    tables=[
        ("auth.users\n(InsForge internal)",A3,[
            ("id","UUID","PK"),("email","TEXT","UNIQUE"),
            ("encrypted_password","TEXT",""),
            ("profile","JSONB",""),("created_at","TIMESTAMPTZ",""),
        ]),
        ("public.users",A1,[
            ("id","UUID","PK, FK->auth.users"),
            ("email","TEXT","NOT NULL"),("name","TEXT",""),
            ("avatar_url","TEXT",""),
            ("credits","INTEGER","DEFAULT 50"),
            ("plan","TEXT","CHECK free|basic|pro"),
            ("plan_expires_at","TIMESTAMPTZ",""),
            ("plan_credits_per_month","INTEGER","DEFAULT 25"),
            ("subscription_rzp_order_id","TEXT",""),
            ("created_at","TIMESTAMPTZ","DEFAULT NOW()"),
            ("updated_at","TIMESTAMPTZ","DEFAULT NOW()"),
        ]),
        ("public.generations",A5,[
            ("id","UUID","PK gen_random_uuid()"),
            ("user_id","UUID","FK->auth.users CASCADE"),
            ("tool","TEXT","NOT NULL"),
            ("source_image_url","TEXT","NOT NULL"),
            ("reference_image_url","TEXT",""),
            ("result_image_url","TEXT","NOT NULL"),
            ("storage_key","TEXT",""),
            ("options","JSONB","DEFAULT {}"),
            ("credits_used","INTEGER","DEFAULT 5"),
            ("created_at","TIMESTAMPTZ","DEFAULT NOW()"),
        ]),
        ("public.subscription_history",A2,[
            ("id","UUID","PK"),
            ("user_id","UUID","FK->auth.users CASCADE"),
            ("plan","TEXT","NOT NULL"),
            ("amount_paise","INTEGER","NOT NULL"),
            ("razorpay_order_id","TEXT",""),
            ("razorpay_payment_id","TEXT",""),
            ("status","TEXT","pending|paid|failed"),
            ("created_at","TIMESTAMPTZ","DEFAULT NOW()"),
            ("paid_at","TIMESTAMPTZ",""),
        ]),
        ("payments.razorpay_orders",A6,[
            ("id","UUID","PK"),
            ("subject_type","TEXT","'user'"),
            ("subject_id","TEXT","-> user.id string"),
            ("provider","TEXT","'razorpay'"),
            ("event_type","TEXT",""),
            ("processing_status","TEXT",""),
            ("payload","JSONB",""),
            ("amount","INTEGER","paise"),
            ("currency","TEXT","INR"),
            ("notes","JSONB","plan,user_id,credits"),
            ("created_at","TIMESTAMPTZ",""),
        ]),
        ("payments.webhook_events",A4,[
            ("id","UUID","PK"),
            ("provider","TEXT","'razorpay'"),
            ("event_type","TEXT","order.paid|payment.captured"),
            ("processing_status","TEXT","triggers fulfillment"),
            ("payload","JSONB","full webhook JSON"),
            ("created_at","TIMESTAMPTZ",""),
        ]),
    ]
    fig,axes=plt.subplots(2,3,figsize=(25,18))
    fig.patch.set_facecolor(BG)
    fig.suptitle("PIXORA AI STUDIO -- Database Tables Reference",
                 fontsize=20,fontweight="bold",color=TH,y=0.99)
    for idx,(name,color,cols) in enumerate(tables):
        ax=axes[idx//3][idx%3]
        ax.set_facecolor(CARD); ax.axis("off")
        rows=[("Column","Type","Constraints")]+[(c,t,k) for c,t,k in cols]
        nrows=len(rows)
        rh=min(0.84/nrows,0.072)
        top=0.91
        ax.text(0.5,0.97,name,ha="center",va="top",transform=ax.transAxes,
                fontsize=11.5,fontweight="bold",color=color,
                path_effects=[pe.withStroke(linewidth=2,foreground=BG)])
        for ri,row in enumerate(rows):
            y=top-ri*rh
            is_hdr=(ri==0)
            bgc=color if is_hdr else (BORDER if ri%2==0 else CARD)
            alp=0.85 if is_hdr else 0.4
            for ci,(val,cx,cw) in enumerate(zip(row,
                    [0.01,0.30,0.52],[0.29,0.22,0.47])):
                ax.add_patch(FancyBboxPatch(
                    (cx,y-rh+0.004),cw,rh-0.006,
                    boxstyle="round,pad=0.004",linewidth=0,
                    facecolor=bgc,alpha=alp,transform=ax.transAxes,zorder=2))
                fc=WH if is_hdr else (A4 if ci==0 else (TD if ci==2 else TB))
                fw="bold" if is_hdr else "normal"
                ax.text(cx+0.01,y-rh/2,str(val),ha="left",va="center",
                        transform=ax.transAxes,fontsize=7.7,fontweight=fw,
                        color=fc,zorder=3,clip_on=True)
        ax.text(0.99,0.01,"RLS Enabled",ha="right",va="bottom",
                transform=ax.transAxes,fontsize=7.2,color=A5,fontstyle="italic")
    plt.tight_layout(rect=[0,0,1,0.97])
    save("pixora_db_tables.png")

# ==============================================================
# DIAGRAM 3 - AI Generation Flow
# ==============================================================
def draw_ai_flow():
    fig,ax=plt.subplots(figsize=(22,14))
    fig.patch.set_facecolor(BG); ax.set_facecolor(BG)
    ax.set_xlim(0,22); ax.set_ylim(0,14); ax.axis("off")
    title_ax(ax,"PIXORA -- AI Generation Data Flow",
             "Beauty Studio -> YouCam AI Engine -> InsForge Storage (10-step pipeline)",A6)

    def nd(x,y,w,h,title,detail,color):
        fbox(ax,x-w/2,y-h/2,w,h,color,zorder=2)
        fbox(ax,x-w/2,y+h/2-0.44,w,0.44,color,fc=color,lw=0,zorder=3,alpha=0.86)
        ax.text(x,y+h/2-0.22,title,ha="center",va="center",fontsize=9,
                fontweight="bold",color=WH,zorder=4)
        lines=detail.split("\n")
        for si,line in enumerate(lines):
            ax.text(x,y+0.2*(len(lines)-1)/2-si*0.27,line,
                    ha="center",va="center",fontsize=7.8,color=TB,zorder=4)

    nd(2.8,11.2,3.8,1.8,"Browser / User","Upload photo\nChoose Tool & Look",A3)
    nd(2.8, 7.5,3.8,1.9,"Next.js Frontend","Beauty Studio UI\napp/studio/beauty/page.tsx",A1)
    nd(9.0, 7.5,4.4,1.9,"API Route","POST /api/studio/beauty/generate\nServer-side secrets",A1)
    nd(9.0, 3.8,4.4,1.8,"InsForge DB Check","SELECT credits\nVerify >= 5 credits",A5)
    nd(16.0,10.5,4.2,2.1,"YouCam Upload","POST /file/mu-transfer\nPOST /file/look-vto\nPOST /file/eye-color-vto",A6)
    nd(16.0, 7.5,4.2,1.9,"YouCam Task API","POST /task/mu-transfer\nPOST /task/look-vto",A6)
    nd(16.0, 4.2,4.2,1.9,"YouCam Polling","GET /task/{id} every 2s\ntask_status: success -> URL",A4)
    nd(9.0, 10.5,4.4,1.9,"InsForge Storage","Bucket: generations\noutputs/{userId}/{ts}.jpg",A5)
    nd(2.8,  4.0,3.8,1.9,"DB Write","UPDATE credits -= 5\nINSERT INTO generations",A1)
    nd(2.8,  1.0,3.8,1.4,"Response","{ resultUrl, creditsRemaining }",A3)

    steps=[(2.8,10.3,"1"),(5.5,7.5,"2"),(9.0,5.4,"3"),
           (12.3,9.2,"4"),(16.0,8.9,"5"),(16.0,5.6,"6"),
           (13.0,6.5,"7"),(9.0,9.0,"8"),(5.5,5.5,"9"),(2.8,2.0,"10")]
    for sx,sy,sn in steps:
        ax.text(sx-0.6,sy,sn,ha="center",va="center",fontsize=10.5,
                color=A4,fontweight="bold",zorder=8,
                bbox=dict(boxstyle="circle,pad=0.18",facecolor=BG,
                          edgecolor=A4,linewidth=1.2,alpha=0.9))

    arr(ax,2.8,10.3,2.8,8.5,"Base64/URL\n+ look",A3)
    arr(ax,4.7,7.5,6.8,7.5,"fetch API",A1)
    arr(ax,9.0,6.6,9.0,4.7,"Check credits",A5)
    arr(ax,11.2,8.0,13.9,10.0,"Upload image\n(presigned)",A6,-0.15)
    arr(ax,16.0,9.5,16.0,8.5,"file_id -> task",A6)
    arr(ax,16.0,6.6,16.0,5.2,"task_id poll",A4)
    arr(ax,13.9,4.7,11.2,10.0,"result URL\ndownload",A5,0.15)
    arr(ax,9.0,9.6,9.0,8.5,"stored URL+key",A5)
    arr(ax,6.8,7.0,4.7,4.9,"deduct & record",A1,-0.1)
    arr(ax,2.8,3.1,2.8,1.7,"JSON result",A3)
    arr(ax,1.5,1.0,1.5,7.5,"show in canvas",A3,0.35)

    save("pixora_ai_flow.png")

# ==============================================================
# DIAGRAM 4 - Payment Flow  
# ==============================================================
def draw_payment():
    fig,ax=plt.subplots(figsize=(22,15))
    fig.patch.set_facecolor(BG); ax.set_facecolor(BG)
    ax.set_xlim(0,22); ax.set_ylim(0,15); ax.axis("off")
    title_ax(ax,"PIXORA -- Payment & Subscription Flow",
             "Razorpay Checkout -> HMAC Verify -> InsForge DB credit grant",A2)

    # lanes
    lane_data=[
        (12.8,2.6,"User / Browser",A3),
        (9.9,2.7,"Frontend (Next.js)",A1),
        (7.0,2.5,"Backend API Routes",A1),
        (4.3,2.5,"Razorpay Gateway",A2),
        (1.6,2.4,"InsForge Database",A5),
    ]
    ly=13.5
    for (bottom,height,lname,lcolor) in lane_data:
        fbox(ax,0.3,bottom-0.05,21.5,height-0.1,lcolor,fc=lcolor,lw=1.2,
             zorder=1,alpha=0.08)
        ax.text(0.55,bottom+height/2-0.05,lname,va="center",fontsize=8.5,
                color=lcolor,fontweight="bold",rotation=90,ha="center",zorder=2)

    def bx(x,y,w,h,title,detail,color):
        fbox(ax,x,y,w,h,color,zorder=3)
        fbox(ax,x,y+h-0.4,w,0.4,color,fc=color,lw=0,zorder=4,alpha=0.88)
        ax.text(x+w/2,y+h-0.2,title,ha="center",va="center",fontsize=8,
                fontweight="bold",color=WH,zorder=5)
        for i,line in enumerate(detail.split("\n")):
            ax.text(x+w/2,y+h-0.65-i*0.3,line,ha="center",va="center",
                    fontsize=7.5,color=TB,zorder=5)

    bx(1.2,12.2,3.5,1.5,"Billing Page",
       "app/studio/billing/page.tsx\nChoose plan",A3)
    bx(5.5,10.0,4.2,1.8,"Upgrade Click",
       "handleUpgrade(plan)\nPOST create-subscription-order",A1)
    bx(10.5,10.0,4.2,1.8,"Razorpay Checkout.js",
       "Payment modal\nUPI/Cards/NetBanking",A2)
    bx(16.0,10.0,4.2,1.8,"onSuccess Handler",
       "razorpay_order_id\nrazorpay_payment_id\nrazorpay_signature",A2)
    bx(1.2,7.1,4.5,1.8,"create-order API",
       "Validate plan & user\nrazorpay.orders.create()\nInsert history pending",A1)
    bx(7.0,4.5,4.5,1.9,"Razorpay Order",
       "order_id, amount INR\nnotes: {plan, user_id, credits}",A2)
    bx(7.0,7.1,4.5,1.8,"verify-subscription",
       "HMAC-SHA256 verify\norder_id|payment_id vs secret\nMatch -> grant credits",A1)
    bx(13.0,4.5,4.5,1.8,"HMAC-SHA256",
       "createHmac('sha256',secret)\n.update(order_id|payment_id)\n.digest('hex') must match",A4)
    bx(1.2,1.5,4.5,2.0,"public.users UPDATE",
       "plan = basic|pro\nplan_expires_at += 30d\ncredits += 350 or 1000",A5)
    bx(6.5,1.5,4.0,2.0,"subscription_history",
       "status = paid\npaid_at = NOW()\nrazorpay_payment_id",A5)
    bx(12.0,1.5,4.8,2.0,"Webhook Trigger",
       "payments.webhook_events\n-> fulfill_subscription()\nidempotent fallback",A4)
    bx(17.5,10.0,3.8,1.8,"UI Updated",
       "Credits in header\nPlan badge\nSuccess toast",A5)

    # plan badges top
    plans=[("Free: 25cr","0",A3,0.6),("Basic: 350cr","999",A1,5.2),
           ("Pro: 1000cr","2799",A2,9.8)]
    for lbl,price,pc,px in plans:
        fbox(ax,px,13.4,4.0,0.9,pc,fc=CARD,lw=1.3,zorder=4,alpha=0.92)
        ax.text(px+0.2,13.85,lbl,va="center",fontsize=9,color=pc,fontweight="bold",zorder=5)
        ax.text(px+0.2,13.52,f"Rs. {price}/mo",va="center",fontsize=8,color=TB,zorder=5)

    # arrows
    ar=lambda x1,y1,x2,y2,lbl="",c=A3,r=0.0: arr(ax,x1,y1,x2,y2,lbl,c,1.7,r)
    ar(2.95,12.2,7.2,11.8,"Click Upgrade",A3,-0.1)
    ar(7.6,10.0,5.5,8.9,"POST order req",A1)
    ar(3.5,7.1,7.0,6.3,"checkoutOptions",A2,0.1)
    ar(9.5,6.5,11.5,10.0,"open modal",A2,-0.25)
    ar(9.7,11.0,10.5,11.0,"",A2)
    ar(14.7,11.0,16.0,11.0,"",A2)
    ar(16.7,10.0,9.8,8.9,"POST verify",A1,-0.05)
    ar(7.0,5.4,8.0,5.4,"",A2,-0.1)
    ar(9.5,7.1,5.5,3.5,"credits\ngrant",A5,0.1)
    ar(9.5,7.1,8.5,3.5,"mark paid",A5,-0.1)
    ar(9.5,7.1,14.0,3.5,"webhook\ntrigger",A4,0.15)
    ar(9.5,7.6,17.5,11.8,"200 success",A5,0.12)

    save("pixora_payment_flow.png")

# ==============================================================
# DIAGRAM 5 - Full Architecture
# ==============================================================
def draw_arch():
    fig,ax=plt.subplots(figsize=(24,15))
    fig.patch.set_facecolor(BG); ax.set_facecolor(BG)
    ax.set_xlim(0,24); ax.set_ylim(0,15); ax.axis("off")
    title_ax(ax,"PIXORA AI STUDIO -- Full System Architecture",
             "Next.js 15 . InsForge BaaS . YouCam AI . Razorpay",A1)

    def zone(x,y,w,h,label,color):
        fbox(ax,x,y,w,h,color,fc=color,lw=1.4,zorder=1,alpha=0.07)
        ax.text(x+w/2,y+h-0.22,label,ha="center",va="center",fontsize=9,
                color=color,fontweight="bold",alpha=0.9,zorder=2)

    def cmp(x,y,w,h,title,detail,color):
        fbox(ax,x,y,w,h,color,zorder=3)
        fbox(ax,x,y+h-0.42,w,0.42,color,fc=color,lw=0,zorder=4,alpha=0.87)
        ax.text(x+w/2,y+h-0.21,title,ha="center",va="center",fontsize=8.5,
                fontweight="bold",color=WH,zorder=5)
        for i,line in enumerate(detail.split("\n")):
            ax.text(x+w/2,y+h-0.65-i*0.29,line,ha="center",va="center",
                    fontsize=7.4,color=TB,zorder=5)

    def ar(x1,y1,x2,y2,lbl="",c=A3,r=0.0):
        arr(ax,x1,y1,x2,y2,lbl,c,1.6,r,7.0)

    zone(0.3, 0.3, 7.9,13.3,"Frontend (Browser + Next.js App Router)",A1)
    zone(8.5, 7.5, 7.1, 5.8,"Backend API Routes (Server-side)",A1)
    zone(8.5, 0.3, 7.1, 6.8,"InsForge BaaS (PostgreSQL + Storage + Auth)",A5)
    zone(16.3,7.5, 7.3, 5.8,"YouCam AI Engine (Perfect Corp)",A6)
    zone(16.3,0.3, 7.3, 6.8,"Razorpay Payment Gateway",A2)

    cmp(0.5,11.5,3.6,1.5,"Landing Page","Hero / Features\nTestimonials / CTA",A3)
    cmp(4.3,11.5,3.4,1.5,"Auth Pages","Login + Signup\nOTP + Google OAuth",A3)
    cmp(0.5, 9.5,3.6,1.7,"Studio Dashboard","Tool Cards / Projects\nRecent AI generations",A1)
    cmp(4.3, 9.5,3.4,1.7,"Beauty Studio","Upload / Look Grid\nBefore After Canvas",A1)
    cmp(0.5, 7.4,3.6,1.8,"Billing Portal","Plan Cards / History\nCredit meter",A2)
    cmp(4.3, 7.4,3.4,1.8,"Projects Gallery","Generation cards\nModal inspector\nPagination",A5)
    cmp(0.5, 5.6,7.2,1.5,"Shared UI System","shadcn/ui . Radix Primitives . Tailwind CSS v4 . Lucide Icons . Geist Font",A3)
    cmp(0.5, 0.5,7.2,4.7,"Auth Context & InsForge SDK","AuthContext (lib/auth-context.tsx)\n@insforge/sdk - database / auth / storage\nNext.js 15 App Router (React 19 TSX)\nTypeScript strict mode\n.env.local - secrets server-only",A1)

    cmp(8.7,10.8,6.7,2.2,"Beauty Generate API","POST /api/studio/beauty/generate\nVerify credits -> Upload -> Task -> Poll\nStore result -> Deduct -> Record",A1)
    cmp(8.7, 7.8,6.7,2.7,"Payments APIs","POST create-subscription-order\nPOST verify-subscription (HMAC)\nPOST manage-subscription\nGET subscription-history",A2)

    cmp(8.7, 4.4,3.0,2.4,"PostgreSQL DB","public.users\npublic.generations\npublic.subscription_history\npayments.*",A5)
    cmp(12.1,4.4,3.1,2.4,"InsForge Storage","Bucket: generations\noutputs/{userId}/{ts}.jpg\nS3-compatible API",A5)
    cmp(8.7, 0.5,6.5,3.5,"Auth & Row Level Security","auth.users (InsForge internal)\nEmail/Password + OTP verify\nGoogle OAuth 2.0 callback\nRLS on all tables - uid() policies\nTrigger: handle_new_user()\nTrigger: fulfill_subscription()",A3)

    cmp(16.5,10.8,6.9,2.2,"YouCam Upload (2-step presigned)","POST /file/mu-transfer\nPOST /file/look-vto\nPOST /file/eye-color-vto",A6)
    cmp(16.5, 7.8,6.9,2.7,"YouCam AI Task Engine","Makeup Transfer (mu-transfer)\nMakeup Try-On (look-vto)\nEye Color Lens (eye-color-vto)\nPoll every 2s -> result image URL",A6)

    cmp(16.5, 4.0,6.9,2.4,"Razorpay Orders API","Create INR orders (paise)\nNotes: { plan, user_id, credits }\nreceipt max 40 chars",A2)
    cmp(16.5, 0.5,6.9,3.2,"Razorpay Checkout & Webhooks","Checkout.js Standard Modal\nUPI / Cards / NetBanking\nWebhook: order.paid payment.captured\npayments.webhook_events trigger",A2)

    ar(7.8,11.2,8.7,11.5,"gen req",A1)
    ar(7.8, 8.5,8.7, 9.0,"payment",A2)
    ar(9.8, 7.8,9.8, 6.8,"CRUD",A5)
    ar(15.3,11.5,16.5,11.5,"upload+task",A6)
    ar(15.3, 9.2,16.5, 9.2,"poll",A6)
    ar(15.3, 8.8,16.5, 5.8,"create order",A2,-0.1)
    ar(15.3, 8.2,16.5, 2.5,"webhooks",A2,-0.15)
    ar(7.8,  3.0,8.7,  3.0,"auth calls",A3)

    badges=[
        (19.8,13.5,"Next.js 15",A1),(21.4,13.5,"React 19",A3),
        (19.8,13.1,"TypeScript",A3),(21.4,13.1,"Tailwind v4",A5),
        (19.8,12.7,"InsForge",A5),(21.4,12.7,"Razorpay",A2),
        (19.8,12.3,"YouCam AI",A6),(21.4,12.3,"shadcn/ui",A1),
    ]
    for bx,by,bl,bc in badges:
        fbox(ax,bx,by-0.16,1.3,0.3,bc,fc=CARD,lw=0.9,zorder=8,alpha=0.92)
        ax.text(bx+0.65,by+0.04,bl,ha="center",va="center",fontsize=7,
                color=bc,fontweight="bold",zorder=9)

    save("pixora_architecture.png")

# ==============================================================
# MAIN
# ==============================================================
if __name__=="__main__":
    print("\n+--------------------------------------------+")
    print("|  Pixora AI Studio -- Generating Diagrams  |")
    print("+--------------------------------------------+\n")
    print("1/5  ER Diagram...")
    draw_er()
    print("2/5  Database Tables...")
    draw_tables()
    print("3/5  AI Generation Flow...")
    draw_ai_flow()
    print("4/5  Payment Flow...")
    draw_payment()
    print("5/5  Full Architecture...")
    draw_arch()
    print("\nAll 5 diagrams saved to: diagrams/")
    print("  pixora_er_diagram.png")
    print("  pixora_db_tables.png")
    print("  pixora_ai_flow.png")
    print("  pixora_payment_flow.png")
    print("  pixora_architecture.png")
